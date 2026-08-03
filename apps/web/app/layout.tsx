import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Web3Provider } from "@/components/providers/web3-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Production-oriented wallet, transaction and cross-chain engineering platform for modern Web3 applications.";

export const metadata: Metadata = {
  metadataBase: new URL("https://chainspan.vercel.app"),
  title: {
    default: "ChainSpan — Web3 Engineering Platform",
    template: "%s | ChainSpan",
  },
  description,
  applicationName: "ChainSpan",
  keywords: [
    "ChainSpan",
    "Web3",
    "blockchain",
    "EVM",
    "wallet",
    "cross-chain bridge",
    "smart contracts",
    "wagmi",
    "viem",
  ],
  authors: [{ name: "Andrii Tsiurupa" }],
  creator: "Andrii Tsiurupa",
  publisher: "ChainSpan",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "ChainSpan",
    title: "ChainSpan — Web3 Engineering Platform",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "ChainSpan — Web3 Engineering Platform",
    description,
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#02040a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#02040a] text-white">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
