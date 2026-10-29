---
title: "Systemd & Gleam"
date: 2026-10-19
tags:
  - Programming
  - Linux
---

In this blog post I am going to discuss an assignment I recently completed for one of my classes. The task was to write a [systemd.unit file](https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html) that manages a simple HTTP server.

I decided this was a good time to familiarize myself with how Systemd services work and finally explore the Gleam programming language, which I have been eying. 

## Systemd?

Systemd was designed to be a better [init](https://en.wikipedia.org/wiki/Init) system. Init systems are the first process spawned by the kernel (PID #1). After being spawned, they are then responsible for spawning the other daemons that the operating system needs to operate. 

When Systemd came into fruition, some critics believed that it betrayed the Unix philosophy of *"Do one thing and do it well."*
It is easy to understand where this criticism was coming from. Systemd had built in dozens of tools such as logging and networking, making it more monolithic than any other init system.

Since the early 2010s, almost every mainstream Linux distribution has adopted it, and it is easy to see why. It is simple to use and has tons of built-in features that makes managing different parts of the system easier. 

The downside to this is that some envrironments are so reliant on Systemd that they no longer offer compatibility with other init systems, something that leaves the end user with less control. Some are even so against Systemd that they have created [an entire website advocating against it](https://nosystemd.org/). 

So where do I personally stand? I lean towards the anti-Systemd group and tend to avoid it when plausible. However, for use on servers, it is the obvious choice, as it simplifies creating services and viewing their logs. I used this assignment as a chance for me to practice configuring services on Systemd.  

## Gleam?

The second part of this assignment was to create a simple webserver. Instead of saving myself from lots of hassle and using a well-established Python library to spin up the server, I decided to use it as a learning opportunity. 

[Gleam](https://gleam.run/) is a fairly young programming language and has only been around for a couple years. It caught my eye some time ago, and I have since wanted an excuse to try it. Gleam stands out from other languages because it is a functional programming language (opposed to procedural or object-oriented), meaning everything is a function. Gleam itself runs off of the Erlang runtime, something that *has* been around for more than a couple of years. Gleam recently rewrote its Erlang generator to compile into Erlang's machine-readable representation of code. So the process is:

```
Gleam source -> Gleam compiler -> Erlang abstract forms -> Erlang compiler -> BEAM code 
```

## The Application

Below is the application code with some of my comments added to help clarify.

```gleam
import gleam/bytes_tree
import gleam/erlang/process
import gleam/http/response
import gleam_community/ansi
import gleam/io
import mist


// response.new(200) gets piped into response.set_body
// as first arg.

pub fn main() {
  let assert Ok(_) =
    mist.new(fn(req) {
      let hit = ansi.cyan("Request for: ") <> ansi.yellow(req.path)
      io.println(hit)
      response.new(200)
      |> response.set_body(
        mist.Bytes(bytes_tree.from_string("Hello, world!\n")),
      )
    })
    // then over here the entire mist.new gets piped, becoming mist.port(previous,8080)
    // and then mist.start(mist.port(mist.new(stuff),8080))
    |> mist.port(8080)
    |> mist.start

  process.sleep_forever()
}
```

One thing that stood out to me was the use of |> a pipe operator. Similar to how pipes are used in Unix systems, the pipe operator allows passing one thing to another. In Gleam this means that the value on the left |> is passed as the first argument to the function on the right. Interesting isn't it?

## The Service

Here is where using Systemd comes into play. We could just run the server from our shell, but then there is no persistence. In order to make sure that the program survives a crash or system reboot, we are going to want a systemd service.


```systemd
[Unit]
Description=Basic http server built with Gleam
After=network.target

[Service]
Type=simple
User=webDEMON
WorkingDirectory=/opt/httpserver/build/erlang-shipment
ExecStart=/bin/sh /opt/httpserver/build/erlang-shipment/entrypoint.sh run
Restart=on-failure
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Some key points:
- WorkingDirectory tells the service where to run from
- ExecStart tells the service how to actually start the service
- Restart tells the service to restart after it fails or reboots
- StandardOutput/Error allows us to get the Gleam logs straight through journalctl


## The Result

::nuxt-img{src="https://raw.githubusercontent.com/michael-kudrik/BlogPosts/refs/heads/main/images/gleamhttp.png" alt="Image showing service running"}
::





