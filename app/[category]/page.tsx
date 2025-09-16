"use client";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import Footer from "@/components/Footer";
import CatalogSection from "@/components/CatalogSection";
import { catalog } from "@/data/catalog";
import type { CatalogItem } from "@/data/types";

const map: Record<string, { title: string; items: CatalogItem[] }> = {
  indicators: { title: "อินดิเคเตอร์ทั้งหมด", items: catalog.indicators },
  ebooks: { title: "Ebook ทั้งหมด", items: catalog.ebooks },
  ea: { title: "EA ทั้งหมด", items: catalog.ea },
  courses: { title: "คอร์สเรียนทั้งหมด", items: catalog.courses },
  articles: { title: "บทความทั้งหมด", items: catalog.articles }
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [q, setQ] = useState("");
  const ctx = map[category] ?? map["indicators"];
  const filtered = useMemo(() => ctx.items.filter((i) => (i.title + i.summary + (i.popup?.intro ?? "")).toLowerCase().includes(q.toLowerCase())), [q, ctx.items]);
  return (
    <main>
      <Background />
      <Navbar />
      <div className="container-narrow pt-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">{ctx.title}</h1>
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="ค้นหา..." className="glass px-4 py-2 text-sm w-56" aria-label="ค้นหา" />
        </div>
        <CatalogSection title="" items={filtered} href={"#"} />
      </div>
      <Footer />
    </main>
  );
}
