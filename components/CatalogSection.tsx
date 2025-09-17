"use client";

import { useCallback, useEffect, useState } from "react";
import SectionHeader from "./Section";
import CatalogCard from "./CatalogCard";
import DetailModal from "./DetailModal";
import type { CatalogItem } from "@/data/types";

type Props = {
  title: string;
  items: ReadonlyArray<CatalogItem>;
  href?: string;
};

export default function CatalogSection({ title, items, href = "#" }: Props) {
  const [open, setOpen] = useState<CatalogItem | null>(null);

  // ปิดโมดัลด้วยปุ่ม ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleOpen = useCallback((it: CatalogItem | null) => setOpen(it), []);

  return (
    <section className="mb-16">
      <SectionHeader title={title} href={href} />

      {items.length === 0 ? (
        <div className="glass p-6 rounded-xl text-center opacity-80">
          ยังไม่มีรายการในหมวดนี้
        </div>
      ) : (
        <div
          className="
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
            [grid-auto-rows:1fr]
          "
        >
          {items.map((it, idx) => (
            <CatalogCard item={it} key={idx} onOpen={handleOpen} />
          ))}
        </div>
      )}

      <DetailModal item={open} onClose={() => setOpen(null)} />
    </section>
  );
}
