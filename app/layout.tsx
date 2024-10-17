import type { Metadata } from "next";
import {IBM_Plex_Sans} from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Mike's Blog",
  description: "Created by Mike Kudrik",
};

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '700'],  // Specify the weights you need
  display: 'swap',  // Specify the weights you need
  subsets: ['latin'],             // Optional: Specify the character subsets
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={ibmPlexSans.className}>
      <body className="dark:bg-slate-800">
        <Navbar />
        <main className="px-4 md:=x-6 prose prose-xl prose-slate dark:prose-invert mx-auto">
        {children}
        </main>
      </body>
    </html>
  );
}
