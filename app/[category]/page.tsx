// app/[category]/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import Footer from "@/components/Footer";
import CatalogSection from "@/components/CatalogSection";
import { catalog } from "@/data/catalog";
import type { CatalogItem } from "@/data/types";
import { XMClaimModal } from "@/components/Modals";

const map: Record<
  string,
  { title: string; items: ReadonlyArray<CatalogItem> }
> = {
  indicators: { title: "อินดิเคเตอร์ทั้งหมด", items: catalog.indicators },
  ebooks: { title: "Ebook ทั้งหมด", items: catalog.ebooks },
  ea: { title: "EA ทั้งหมด", items: catalog.ea },
  courses: { title: "คอร์สเรียนทั้งหมด", items: catalog.courses },
  articles: { title: "บทความทั้งหมด", items: catalog.articles },
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [q, setQ] = useState("");
  const ctx = map[category] ?? map["indicators"];

  const filtered = useMemo(
    () =>
      ctx.items.filter((i) =>
        (i.title + i.summary + (i.popup?.intro ?? ""))
          .toLowerCase()
          .includes(q.toLowerCase())
      ),
    [q, ctx.items]
  );

  const isEbook = category === "ebooks";
  const isIndicator = category === "indicators";

  return (
    <main className="relative">
      <Background />
      <Navbar />

      {/* เพิ่มระยะห่างจาก Navbar ที่ fixed (เดิม pt-10) */}
      <div className="container-narrow pt-28 md:pt-32 relative z-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">{ctx.title}</h1>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหา..."
            className="glass px-4 py-2 text-sm w-full md:w-64 rounded-xl"
            aria-label="ค้นหา"
          />
        </div>

        <CatalogSection
          title=""
          items={filtered}
          href="#"
          variant={isIndicator ? "indicator" : isEbook ? "ebook" : "default"}
        />
      </div>

      <Footer />
    </main>
  );
}
