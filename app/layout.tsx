import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import logo from "../public/incologo.svg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "inco game",
  description: "Have fun while learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <nav className="sticky top-0 z-50 shadow-2xl bg-transparent border-b-1">
      <div className="container mx-auto flex justify-between items-center px-4 py-5 ">
          <a href="https://www.inco.org/">
            <Image src={logo} alt="name" className="w-[90px] md:w-[150px]" />
          </a>
          <h3 className="font-semibold text-[#9CA3AF] text-[18px] md:text-xl md:font-bold">
            Game/Quiz
          </h3>
        </div>
      </nav>
          <main className="transition-all transform ease-in-out duration-1000 delay-1200 flex-grow container mx-auto px-4 ">
             {children}
          </main>

            
       
      </body>
    </html>
  );
}
