import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ravaan Space Portal - Human Resource Management System",
  description: "Modern HR Management System for Ravaan Space, built with Next.js, TypeScript, and Tailwind CSS.",
  keywords: ["Ravaan Space", "HR", "Human Resources", "Next.js", "TypeScript", "Tailwind CSS", "Employee Management"],
  authors: [{ name: "Ravaan Space IT Team" }],
  openGraph: {
    title: "Ravaan Space Portal - Manage Your Workspace",
    description: "Enjoy your workspace. Access Ravaan Space's employee dashboard to view payslips, claim expenses, and submit leave requests natively.",
    url: "https://ravaanspace.com",
    siteName: "Ravaan Space HRMS",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Ravaan Space Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ravaan Space Portal - Human Resource Management System",
    description: "Modern HR Management System for Ravaan Space. Enjoy your workspace.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
