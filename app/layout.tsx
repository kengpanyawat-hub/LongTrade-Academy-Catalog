import "./globals.css";
import { Prompt } from "next/font/google";
import type { Metadata } from "next";
import { ReactNode } from "react";
import SmoothScroll from "@/components/SmoothScroll";

const prompt = Prompt({ subsets: ["thai","latin"], weight: ["300","400","600","700"] });

export const metadata = {
  title: 'Longtrade Academy',
  description: 'คลังความรู้ เครื่องมือ เทรดดิ้ง',
  openGraph: {
    title: 'Longtrade Academy',
    description: 'คลังความรู้สำหรับนักเทรดทุกระดับ',
    url: 'https://longtrade-academy.com/',
    siteName: 'Longtrade Academy',
    images: [{ url: '/og.jpg', width: 1200, height: 630 }],
  },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className={prompt.className}>
      <body className="min-h-dvh">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
