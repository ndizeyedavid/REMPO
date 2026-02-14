import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";

const siteUrl = "https://rempo.vercel.app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "REMPO",
    template: "%s | REMPO",
  },
  description: "Remember what you were building",
  applicationName: "REMPO",
  keywords: [
    "REMPO",
    "git",
    "repository",
    "repository manager",
    "desktop app",
    "electron",
    "developer tools",
    "AI summaries",
    "groq",
    "llama",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "REMPO",
    description: "Remember what you were building",
    siteName: "REMPO",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "REMPO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "REMPO",
    description: "Remember what you were building",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
