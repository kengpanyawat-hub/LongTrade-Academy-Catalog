import "./globals.css";
import { Prompt } from "next/font/google";
import type { Metadata } from "next";
import { ReactNode } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import { ToastProvider } from "@/components/Toast";
import SupportWidget from "@/components/SupportWidget";

const prompt = Prompt({ subsets: ["thai","latin"], weight: ["300","400","600","700"] });
const SITE_URL = "https://longtrade-catalog.vercel.app"; // <- โดเมนโปรดักชันของคุณ
const SITE_NAME = "Longtrade Academy";
const DESCRIPTION =
  "คลังความรู้สำหรับนักเทรดทุกระดับ อินดิเคเตอร์ เครื่องมือ และบทความที่ใช้งานได้จริง";
const OG_IMAGE = `${SITE_URL}/og/cover.jpg`; // public/og/cover.jpg

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DESCRIPTION,
    locale: "th_TH",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className={prompt.className}>
      <body className="min-h-dvh">
        <SmoothScroll />
		<ToastProvider>
        {children}
		</ToastProvider>
		{/* Floating Intercom-style widget: แสดงทุกหน้า */}
        <SupportWidget />
      </body>
    </html>
  );
}
