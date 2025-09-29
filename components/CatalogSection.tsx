"use client";

import { useState } from "react";
import CatalogCard from "./CatalogCard";
import DetailModal from "./DetailModal";
import SectionHeader from "./Section";
import type { CatalogItem } from "@/data/types";

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

  // เดา variant จากหัวข้อ (ไม่แคร์ตัวพิมพ์เล็ก/ใหญ่)
  const t = title.toLowerCase();
  const computedVariant: Variant =
    variant ??
    (t.includes("ebook")
      ? "ebook"
      : t.includes("อินดิเคเตอร์")
      ? "indicator"
      : "default");

  return (
    <section className="mb-16">
      <SectionHeader title={title} href={href} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it, idx) => (
          <CatalogCard
            key={idx}
            item={it}
            onOpen={setOpen}
            variant={computedVariant}
          />
        ))}
      </div>

      {/* แสดงโมดัลเมื่อมี item เท่านั้น */}
      {open && (
        // @ts-expect-error – ใช้ข้าม error typing ชั่วคราวของ DetailModal ในโปรเจ็กต์นี้
        <DetailModal item={open} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}
