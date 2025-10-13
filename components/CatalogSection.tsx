"use client";

import { useState } from "react";
import CatalogCard from "./CatalogCard";
import SectionHeader from "./Section";
import type { CatalogItem } from "@/data/types";
import { DetailModal } from "@/components/Modals";  // <- ใช้จากไฟล์รวม

type Variant = "default" | "ebook" | "indicator";

export default function CatalogSection({
  title,
  items,
  href,
  variant,
}: {
  title: string;
  items: ReadonlyArray<CatalogItem>;
  href: string;
  /** ไม่ส่งมาก็ได้ – ถ้าไม่ส่ง จะพยายามเดาจาก title */
  variant?: Variant;
}) {
  const [open, setOpen] = useState<CatalogItem | null>(null);

  // ถ้าไม่ได้ส่ง variant มา พยายามเดาจากหัวข้อ
  const computedVariant: Variant =
    variant ??
    (title.includes("Ebook")
      ? "ebook"
      : title.includes("อินดิเคเตอร์")
      ? "indicator"
      : "default");

  return (
    <section className="mb-16">
      <SectionHeader title={title} href={href} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it, idx) => (
          <CatalogCard
            item={it}
            key={idx}
            onOpen={setOpen}
            variant={computedVariant}
          />
        ))}
      </div>

      {/* แสดงโมดัลเมื่อมี item เท่านั้น */}
      {open && <DetailModal item={open} onClose={() => setOpen(null)} />}
    </section>
  );
}