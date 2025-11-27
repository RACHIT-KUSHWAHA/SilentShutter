import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Silent Shutter • Lenslogue",
  description: "Rachit Sharma's zero-budget photography platform with metadata.",
  metadataBase: new URL("https://silent-shutter.local"),
  openGraph: {
    title: "Silent Shutter • Lenslogue",
    description: "Street grit, portraits, and nature frames with transparent metadata.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Silent Shutter",
    description: "A budget-zero photography platform by Rachit Sharma.",
  },
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
