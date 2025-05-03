"use client"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthContext from "@/context/auth-context";
import InstructorContext from "@/context/instructor-context";
import StudentProvider from "@/context/student-context"
import RouteGuard from "@/components/common-form/Route-guard"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <AuthContext>
          <InstructorContext>
         <StudentProvider>
        <RouteGuard
        authenticated={true}
        user={{role:"student"}}
        >
        {children}
        </RouteGuard>
        </StudentProvider>
        </InstructorContext>
        </AuthContext>
      </body>
    </html>
  );
}
