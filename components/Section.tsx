// components/Section.tsx
"use client";
import Link from "next/link";

export default function SectionHeader({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  return (
    <div
      className="
        mb-6 rounded-xl overflow-hidden relative
        border border-red-500/20
        bg-[linear-gradient(180deg,rgba(255,60,60,.08),rgba(0,0,0,.2))]
        shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset,0_20px_60px_-30px_rgba(255,0,0,.25)]
      "
    >
      {/* แถบเรืองๆ ด้านหลัง */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_0%_0%,rgba(255,0,0,.15),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_100%_0%,rgba(255,0,0,.1),transparent)]" />

      <div className="relative flex items-center justify-between px-5 py-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-wide">
          {title}
        </h2>

        {href ? (
          <Link
            href={href}
            className="
              inline-flex items-center gap-2
              rounded-full px-4 py-1.5
              border border-red-500/40
              bg-white/[.02]
              hover:bg-white/[.05]
              transition-colors
              text-sm
            "
          >
            ดูทั้งหมด
            <span aria-hidden>›</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
