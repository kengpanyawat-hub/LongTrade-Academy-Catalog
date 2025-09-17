// components/PromoSplit.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";
import type { ReactNode } from "react";

type PromoSplitProps = {
  title: string;
  p1: ReactNode;
  p2: ReactNode;
  p3?: ReactNode;
  ctaText?: string;
  href?: string;
  image?: string;
  alt?: string;
  className?: string;
};

export default function PromoSplit({
  title,
  p1,
  p2,
  p3,
  ctaText = "เริ่มใช้งานเลย",
  href = "#",
  image = "https://ik.imagekit.io/pcqgvgpgi1/bg%20graph.jpg",
  alt = "trading illustration",
  className,
}: PromoSplitProps) {
  return (
    <section
      className={clsx(
        "relative overflow-hidden rounded-3xl p-8 md:p-12",
        "bg-white/[0.04] border border-white/10 backdrop-blur-sm",
        "shadow-[inset_0_1px_0_rgba(255,255,255,.06)]",
        className
      )}
    >
      {/* glow ตามธีมแดง */}
      <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(55%_45%_at_10%_10%,rgba(255,0,0,.16),transparent_65%),radial-gradient(55%_45%_at_90%_90%,rgba(255,70,70,.22),transparent_65%)]" />

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* text side */}
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
            {title}
          </h2>
          <p className="mt-4 text-white/85">{p1}</p>
          <p className="mt-2 text-white/80">{p2}</p>
          {p3 ? <p className="mt-2 text-white/80">{p3}</p> : null}

          <Link
            href={href}
            className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3
                       bg-rose-500 hover:bg-rose-400 text-white font-semibold
                       shadow-[0_8px_28px_rgba(244,63,94,.35)] transition"
          >
            {ctaText}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* image side */}
        <div className="relative h-56 md:h-72">
          <Image
            src={image}
            alt={alt}
            fill
            className="object-cover rounded-2xl border border-white/10"
            sizes="(min-width: 768px) 40vw, 90vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}
