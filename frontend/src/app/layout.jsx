"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthContext, { useAuthContext } from "@/context/auth-context";
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
}) {

  const {auth} = useAuthContext() || {}

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <AuthContext>
          <InstructorContext>
         <StudentProvider>
        <RouteGuard
        authenticated={auth?.authenticate}
        user={auth?.user}
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
