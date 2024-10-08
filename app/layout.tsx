import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import MyProfilePic from "./components/myPicture";

export const metadata: Metadata = {
  title: "Mike's Blog",
  description: "Created by Mike Kudrik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark:bg-slate-800">
        <Navbar />
      {/* /<MyProfilePic/> */}
        {children}
      </body>
    </html>
  );
}
