"use client";

import { useState } from "react";
import SectionHeader from "./Section";
import CatalogCard from "./CatalogCard";
import DetailModal from "./DetailModal";
import type { CatalogItem } from "@/data/types";

type Props = {
  title: string;
  items: CatalogItem[];
  href: string;
  /** รองรับรูปแบบเดิมที่หน้าแรกส่งเข้ามา */
  imageAspect?: "wide" | "tall";
  /** รองรับรูปแบบที่หน้าหมวดส่ง variant เข้ามา */
  variant?: "default" | "ebook";
};

export default function CatalogSection({
  title,
  items,
  href,
  imageAspect,
  variant = "default",
}: Props) {
  const [open, setOpen] = useState<CatalogItem | null>(null);

  // กำหนดสัดส่วนรูปปกที่จะส่งให้การ์ด
  // - ถ้ามี imageAspect ให้ใช้ตามนั้น
  // - ถ้า variant = 'ebook' ให้ใช้ 'tall'
  // - ถ้าไม่ใช่ทั้งสองกรณี ใช้ 'wide' เป็นค่าเริ่มต้น
  const coverAspect: "wide" | "tall" =
    imageAspect ?? (variant === "ebook" ? "tall" : "wide");

  return (
    <section className="mb-16">
      <SectionHeader title={title} href={href} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it, idx) => (
          <CatalogCard
            key={idx}
            item={it}
            onOpen={setOpen}
            coverAspect={coverAspect}
          />
        ))}
      </div>
      <DetailModal item={open} onClose={() => setOpen(null)} />
    </section>
  );
}
