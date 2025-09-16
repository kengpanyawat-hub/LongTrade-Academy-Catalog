"use client";
import { useState } from "react";
import SectionHeader from "./Section";
import CatalogCard from "./CatalogCard";
import DetailModal from "./DetailModal";
import { CatalogItem } from "@/data/types";

export default function CatalogSection({ title, items, href }: { title: string; items: CatalogItem[]; href: string }) {
  const [open, setOpen] = useState<CatalogItem | null>(null);
  return (
    <section className="mb-16">
      <SectionHeader title={title} href={href} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it, idx) => (<CatalogCard item={it} key={idx} onOpen={setOpen} />))}
      </div>
      <DetailModal item={open} onClose={() => setOpen(null)} />
    </section>
  );
}
