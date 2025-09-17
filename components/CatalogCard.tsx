"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { CatalogItem } from "@/data/types";
import clsx from "clsx";

type CatalogCardProps = {
  item: CatalogItem;
  onOpen?: (item: CatalogItem) => void;
  /** สัดส่วนรูปปก: default = wide(16/9), tall = แนวตั้งสำหรับ ebook */
  coverAspect?: "wide" | "tall";
};

export default function CatalogCard({ item, onOpen, coverAspect = "wide" }: CatalogCardProps) {
  const isTall = coverAspect === "tall";

  return (
    <article className="glass rounded-2xl overflow-hidden border border-white/10 flex flex-col">
      {/* รูปปก */}
      <div
        className={clsx(
          "relative w-full",
          // wide = 16/9 (default), tall = 3/4 สำหรับ ebook
          isTall ? "aspect-[3/4]" : "aspect-[16/9]"
        )}
      >
        <Image
          src={item.cover}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={false}
        />
      </div>

      {/* เนื้อหา */}
      <div className="p-4 md:p-5 flex flex-col gap-3 grow">
        <h3 className="font-semibold text-lg leading-snug">{item.title}</h3>
        {item.summary ? (
          <p className="text-sm text-white/75 line-clamp-2">{item.summary}</p>
        ) : null}

        {/* ปุ่ม */}
        <div className="mt-auto flex items-center gap-3 pt-2">
          <button
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition text-sm"
            onClick={() => onOpen?.(item)}
          >
            ดูรายละเอียด
          </button>

          {item.website ? (
            <Link
              href={item.website}
              target="_blank"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition text-sm inline-flex items-center gap-2"
            >
              เว็บไซต์ <ExternalLink className="w-4 h-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
