// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { content } from "@/data/content";
import {
  Star,          // หน้าหลัก
  TrendingUp,    // อินดิเคเตอร์
  BookOpen,      // Ebook
  Bot,           // EA
  GraduationCap, // คอร์สเรียน
  FileText,      // บทความ
  MessageCircle, // CTA (สั่งซื้อ/สอบถาม)
  Tag            // โปรโมชั่น
} from "lucide-react";

/* ===== Types for optional CMS site settings ===== */
type CmsMenuItem = { label: MenuLabel; href: string };
type CmsSiteSettings = {
  navbar?: {
    menu?: CmsMenuItem[];
    cta_text?: string;
    cta_link?: string;
  };
};

/* ===== App defaults (fallback) ===== */
type MenuLabel =
  | "หน้าหลัก"
  | "อินดิเคเตอร์"
  | "Ebook"
  | "EA"
  | "คอร์สเรียน"
  | "บทความ"
  | "โปรโมชั่น";

const iconMap: Record<MenuLabel, React.ComponentType<{ className?: string }>> = {
  "หน้าหลัก": Star,
  "อินดิเคเตอร์": TrendingUp,
  "Ebook": BookOpen,
  "EA": Bot,
  "คอร์สเรียน": GraduationCap,
  "บทความ": FileText,
  "โปรโมชั่น": Tag,
};

const toHref = (label: string) => {
  switch (label as MenuLabel) {
    case "หน้าหลัก": return "/";
    case "อินดิเคเตอร์": return "/indicators";
    case "Ebook": return "/ebooks";
    case "EA": return "/ea";
    case "คอร์สเรียน": return "/courses";
    case "บทความ": return "/articles";
    case "โปรโมชั่น": return "/promo";
    default: return "/";
  }
};

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // ---- pull from CMS (optional) ----
  const [cms, setCms] = useState<CmsSiteSettings | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/cms/site-settings", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as CmsSiteSettings;
        if (alive) setCms(data);
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  // helper เช็ค active: หน้า section ให้ติด active เมื่อ path เริ่มด้วย href
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  // เมนูหลัก: ถ้า CMS มีให้ใช้, ถ้าไม่มีก็ fallback เป็นของเดิม + ‘โปรโมชั่น’
  const fallbackMenus: MenuLabel[] = [
    ...(content.navbar.menu as MenuLabel[]),
    "โปรโมชั่น",
  ];
  const menus: MenuLabel[] = useMemo(() => {
    const m = cms?.navbar?.menu?.map((x) => x.label);
    return (m && m.length) ? (m as MenuLabel[]) : fallbackMenus;
  }, [cms]);

  const ctaText = cms?.navbar?.cta_text || content.navbar.cta_text;
  const ctaLink = cms?.navbar?.cta_link || content.navbar.cta_link;

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <nav className="nav-shell px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-extrabold tracking-wide text-xl">
          <span className="text-brand">LONGTRADE</span> ACADEMY
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          {menus.map((label) => {
            const href = toHref(label);
            const Icon = iconMap[label] ?? Star;
            const active = isActive(href);
            return (
              <Link key={label} href={href} className={`pill ${active ? "active" : ""}`}>
                <Icon className="h-4.5 w-4.5" />
                {label}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="hidden lg:block">
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="pill cta inline-flex items-center gap-2"
          >
            <MessageCircle className="h-4.5 w-4.5" />
            {ctaText}
          </a>
        </div>

        {/* Mobile button */}
        <button
          className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10"
          onClick={() => setOpen(true)}
          aria-label="เมนู"
        >
          ☰
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="mx-auto mt-20 max-w-2xl nav-overlay p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-xl font-extrabold mb-4">
              <span className="text-brand">Long</span>trade Academy
            </div>

            <div className="grid gap-3">
              {menus.map((label) => {
                const href = toHref(label);
                const Icon = iconMap[label] ?? Star;
                const active = isActive(href);
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`pill ${active ? "active" : ""}`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-6">
              <a
                href={ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="pill cta w-full justify-center inline-flex items-center gap-2"
              >
                <MessageCircle className="h-4.5 w-4.5" />
                {ctaText}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
