"use client";
import Image from "next/image";
import { CatalogItem } from "@/data/types";

export default function CatalogCard({ item, onOpen }: { item: CatalogItem; onOpen: (i: CatalogItem)=>void; }) {
  return (
    <button className="card text-left a11y-focus reveal" onClick={()=>onOpen(item)} aria-label={`ดูรายละเอียด ${item.title}`}>
      <div className="card-img">
        <Image src={item.cover} alt={item.title} fill />
        <div className="card-gradient" />
      </div>
      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>
        <p className="card-summary">{item.summary}</p>
        <span className="inline-block mt-3 text-brand/90 text-sm">ดูรายละเอียด →</span>
      </div>
    </button>
  );
}
