// app/sitemap.ts
import type { MetadataRoute } from "next";

const SITE_URL = "https://longtrade-catalog.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/indicators`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/ebooks`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    // ถ้ามีหน้าอื่น ๆ ใส่เพิ่มได้เลย
  ];
}
