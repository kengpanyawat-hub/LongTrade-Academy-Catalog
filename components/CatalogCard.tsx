"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useMemo } from "react";
import type { CatalogItem } from "@/data/types";

type Variant = "default" | "ebook" | "indicator";

export default function CatalogCard({
  item,
  onOpen,
  variant = "default",
}: {
  item: CatalogItem;
  onOpen?: (it: CatalogItem) => void;
  variant?: Variant;
}) {
  // อัตราส่วนภาพ
  const imageWrapClass =
    variant === "ebook"
      ? "relative w-full aspect-[3/4] overflow-hidden rounded-t-2xl"
      : "relative w-full aspect-[16/9] overflow-hidden rounded-t-2xl";

  const imageClass = "object-cover";

  // กำหนดปลายทางของปุ่ม "ดูรายละเอียด" สำหรับการ์ดประเภทอินดิเคเตอร์
  // - GOLDFLOW   -> /indicators/goldflow
  // - Boost Cap I -> /indicators/boost-capital
  const indicatorDetailHref = useMemo(() => {
    if (variant !== "indicator") return "#";
    const key = (item as any)?.slug ?? item.title ?? "";
    const t = String(key).toLowerCase();

    if (t.includes("boost-capital") || t.includes("boost") || t.includes("bci")) {
      return "/indicators/boost-capital";
    }
    // default = goldflow
    return "/indicators/goldflow";
  }, [variant, item]);

  // ซ่อนปุ่ม "ดูรายละเอียด" เฉพาะการ์ดอินดิเคเตอร์ตัวที่ 3 (LT Intelligence)
  const hideDetailButton = useMemo(() => {
    const key = (item as any)?.slug ?? item.title ?? "";
    const t = String(key).toLowerCase();
    // รองรับทั้งชื่อและ slug
    return t.includes("lt intelligence") || t.includes("lt-intelligence");
  }, [item]);

  return (
    <article className="group rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
      {/* ภาพ */}
      <div className={imageWrapClass}>
        <Image
          src={item.cover}
          alt={item.title}
          fill
          className={imageClass}
          sizes="(min-width:1024px) 33vw, 100vw"
          priority={false}
        />
      </div>

      {/* เนื้อหา */}
      <div className="p-6">
        <h3 className="text-xl md:text-2xl font-extrabold leading-tight">
          {item.title}
        </h3>
        <p className="mt-2 text-white/70 line-clamp-2">{item.summary}</p>

        {/* ปุ่มของการ์ด */}
        <div className="mt-5 flex items-center gap-3">
          {/* อ่านเพิ่มเติม (เปิดโมดัล) */}
          <button
            onClick={() => onOpen?.(item)}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition"
          >
            อ่านเพิ่มเติม
          </button>

          {/* อินดิเคเตอร์: ปุ่ม 'ดูรายละเอียด' → ซ่อนเฉพาะ LT Intelligence */}
          {variant === "indicator" && !hideDetailButton && (
            <Link
              href={indicatorDetailHref}
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 inline-flex items-center gap-2 transition"
              aria-label={`ดูรายละเอียด ${item.title}`}
            >
              ดูรายละเอียด <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
