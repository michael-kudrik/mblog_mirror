---
title: "Firewall Class"
date: 2026-05-23
tags:
  - Personal
  - Cybersec
---
# My Firewalling Class

This semester, one of the required classes for my Cybersecurity & Networking degree was on firewalls. It has been a while since I've written a blog here, so it is long overdue that I get you all up to speed. 

There are so many classes that I have taken so far in my three years attending college, but this one by far has been one of the most enjoyable. My professor was able to secure some educational licenses for Palo Alto's VM-50 firewalls, which are designed specifically for use on virtual machines. There were so many features that we touched on, so I will try to outline the main ones in this article. 
## The Foundation

For this class, we had access to the schools Proxmox cluster. This meant that each student was able to control their own individual VM-50. 

Below is a screenshot of the Proxmox environment.

::nuxt-img{src="https://raw.githubusercontent.com/navidrome/navidrome/master/.github/screenshots/ss-desktop-player.png"}
::

The firewall was managed through the designated management interface which we visited at *172.16.42.92*. 

92 was an important number for me because that was my individually assigned VLAN. Below is an easier to digest view to better understand how this whole infrastructure is actually scaffolded. 

::nuxt-img{src="https://raw.githubusercontent.com/michael-kudrik/BlogPosts/858ddde5bfb1eb044014a234f69a3364ee9d3e36/images/firewall_topo.png"}
::

### Interfaces & Security Zones

Throughout the semester we had four distinct security boundaries in our pseudo enterprise network. 

- **Outside Edge (ethernet1/1)**: configured as a physical Layer 3 interface that faced our simulated public internet on the *198.51.100.92/24* subnet. A static IP address *198.51.100.93/32* was used to act as a public-facing NAT translation point. 
- **DMZ segment (ethernet1/2.92)**: is a virtual sub-interface that held our public facing server *mrfoofoo93.com* that was mapped to *10.1.92.10*. This allowed our server to be isolated from the sensitive internal network since it got accessed from "outside" traffic. 
- **Internal segment (ethernet1/2.93)**: was another virtual sub-interface that ran the *10.1.93.1/24* subnet. This segment was arguably the most important since it was essentially the internal company intranet. It held my testing workstation *(mkudrik@lulu-kudrik* at *10.1.93.128)* , and also my logging server *(mkudrik-graylog* at *10.1.93.129)*. More on those later. 
- **Sales segment**: at this fictitious company, the employees who work in the sales department are so poorly behaved that they had to get their own VLAN 94. The traffic here was strictly monitored, and I will get into more detail.


::nuxt-img{src="https://raw.githubusercontent.com/michael-kudrik/BlogPosts/858ddde5bfb1eb044014a234f69a3364ee9d3e36/images/firewallprox_2.png"}
::

By consolidating all the sub-interfaces into a unified virtual router, and then pointing the system's default route to 0.0.0.0/0, upstream of the edge router gateway *(198.51.100.1)*, we had a zero trust topology going for us. 
## Identity-based Access Control

This is the main concept of firewalls. Prevent unwanted access to places, and grant access to those who deserve it. Traditional firewalls are simple. They limit traffic based on IP source/destination, and port numbers. Today though, attackers can easily move laterally and tunnel malicious traffic through standard open ports like HTTPS. To combat this, we were able to take advantage of the next-generation firewall features that Palo Alto provided us with. Things like User-ID and authentication portals allowed us to establish the identity of people attempting to connect to certain sites. 

### LDAP

The backbone of our identity-aware approach relied on LDAP or Lightweight Directory Access Protocol. By connecting the firewall to this LDAP server, it was able to look up group memberships in real time and see how they held up in relation to the security policy. 

In order to use LDAP, we created a server profile in PAN-OS called mff-ldap and pointed it to the mff-dc domain controller. We then configured a distinguished name *dc=mrfoofoo,dc=com* with an administrative bind DN of *cn=admin,dc=mrfoofoo,dc=com*. In doing this step we also had to secure the LDAP connection using a self-signed cert. 

Doing all this allowed us to take individual users and limit what websites they were able to access. An example of this might be a rule called *allow-engineering-robosawmill* which takes members of the engineering team: *cn=engineering,ou=groups,dc=mrfoofoo,dc=com* and allows them to access a certain website such as robosawmill.com. 

## App-ID

App-ID is where the "next-gen" part starts to shine. Traditionally firewalls only inspected the layer 3 & 4 (network & transport) headers, checking things like IP addresses and what port a packet was on. This was great at the time, but nowadays, hackers can simply use unconventional ports, encryption, or other techniques to mask the packets. 

App-ID, however inspects the packet payloads at layer 7 (application layer) and uses a combination of signatures, decoders, and behavioral checks to identify the applications on a much more refined level. Once the application is identified, a policy check will determine how to treat the application, and if it should be blocked or not. Quite the wizardry. 

We to advantage of this a ton throughout the class. A simple example was creating a policy to allow members of the sales group to safely browse the internet. By creating a policy, and restricting it to the *ssl* and *web-browsing* categories in PAN-OS, it meant that we could not have unauthorized services attempting to infiltrate under the 80 and 443 ports, which typically see web traffic. 

Something else we did was define a custom App-ID to prevent against a typosquatted domain. By setting the scope to be a transaction based pattern match we told the firewall to analyze the entire application and not just individual packets. Then we set the context to be *http-req-host-header* which tells it to look at the host field of the incoming HTTP request header. We pattern matched that header to this pattern: *^.*micros0ft\.com* which tells the rule to trigger when a request comes in from anything containing micros0ft.com (the fake website). 

## Site to Site IPsec VPN 

In the corporate world, companies that have multiple locations may want to be able to access servers or computers from each other. It is essential that they do so using encrypted tunnels so that bad actors cannot get hold of sensitive company data. 

PAN-OS uses route-based VPNs which means that traffic gets directed into a dedicated tunnel. One of the assignments we had to establish a site to site VPN connection between the internal company and our sister location (in Vietnam maybe? I forget . . .) called *drfangs*. We created a layer 3 tunnel interface on the firewall and attached it to our virtual router in PAN-OS, making sure everything was inside a security zone so we could still inspect traffic. Then we added a static route, directing the remote *10.50.1.0/24* subnet across our tunnel. This meant that whenever one of our employees wanted to access an IP in that subnet, they were directed towards the tunnel. 

Something interesting about our approach here was that we forced the VPN to encrypt using [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) with [SHA-384](https://en.wikipedia.org/wiki/SHA-2) for integrity verification. It was really cool learning about these methods, and how they are considered to be [post-quantum cryptographic methods](https://en.wikipedia.org/wiki/Post-quantum_cryptography). Because of the advent of quantum computing, there is a strategy called [harvest now, decrypt later](https://en.wikipedia.org/wiki/Harvest_now,_decrypt_later) which relies on capturing encrypted traffic today in hopes of being able to decipher it in the future when quantum computers make doing so trivial. For the key negotiation we set the gateway to use only [IKEv2](https://www.paloaltonetworks.com/cyberpedia/what-is-ikev2), and authenticate with a pre-shared key. 

## Logs, logs, and more logs

As you probably saw in the diagram at the start of the article, we were tasked in spinning up a dedicated syslog server. This server was used to gather log files from the firewall, and is commonly used alongside a SIEM. Inside PAN-OS we were able to set up a log forwarding profile called *ship-to-syslog* and apply them to our security rules. This meant that if a certain rule got triggered, we could send the log over to our machine for recording purposes. 

All of this happened in real time so instead of sitting in the firewall's web GUI we could drop into the Linux machine and browse the log file using something like [lnav](https://github.com/tstack/lnav). 

## Wrapping up

This was one of my favorite classes taken, and it was with a professor who is in a league of his own when it comes to great teaching. I wish that every class took as hands-on of an approach as this one. Being able to interact with an enterprise-grade firewall is not something every cybersecurity student is able to say they have done. I am very grateful for the resources which the school has provided, and for my teacher for going above and beyond. 

This article took much longer to write then I am willing to admit, mostly because I was on and off with writing over a long time span. As the time since taking the class grew longer, it became more difficult than expected to remember all the technical details of the infrastructure and assignments. That being said there may be some errors in this article, and I may have omitted some aspects due to simply forgetting I did them.  