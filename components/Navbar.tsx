// components/Navbar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { content } from "@/data/content";
import {
  Star,          // หน้าหลัก
  TrendingUp,    // อินดิเคเตอร์
  BookOpen,      // Ebook
  Bot,           // EA
  GraduationCap, // คอร์สเรียน
  FileText,      // บทความ
  MessageCircle  // CTA (สั่งซื้อ/สอบถาม)
} from "lucide-react";

type MenuLabel =
  | "หน้าหลัก"
  | "อินดิเคเตอร์"
  | "Ebook"
  | "EA"
  | "คอร์สเรียน"
  | "บทความ";

const iconMap: Record<MenuLabel, React.ComponentType<{ className?: string }>> = {
  "หน้าหลัก": Star,
  "อินดิเคเตอร์": TrendingUp,
  "Ebook": BookOpen,
  "EA": Bot,
  "คอร์สเรียน": GraduationCap,
  "บทความ": FileText,
};

const toHref = (label: string) => {
  switch (label) {
    case "หน้าหลัก": return "/";
    case "อินดิเคเตอร์": return "/indicators";
    case "Ebook": return "/ebooks";
    case "EA": return "/ea";
    case "คอร์สเรียน": return "/courses";
    case "บทความ": return "/articles";
    default: return "/";
  }
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <nav className="nav-shell px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-extrabold tracking-wide text-xl">
          <span className="text-brand">Long</span>trade Academy
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          {content.navbar.menu.map((label) => {
            const href = toHref(label);
            const Icon = iconMap[label as MenuLabel] ?? Star;
            const active = pathname === href;
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
          <a href={content.navbar.cta_link} target="_blank" className="pill cta inline-flex items-center gap-2">
            <MessageCircle className="h-4.5 w-4.5" />
            {content.navbar.cta_text}
          </a>
        </div>

        {/* Mobile button */}
        <button
          className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10"
          onClick={() => setOpen(true)} aria-label="เมนู"
        >☰</button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="mx-auto mt-20 max-w-2xl nav-overlay p-6" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center gap-2 text-xl font-extrabold mb-4">
              <span className="text-brand">Long</span>trade Academy
            </div>
            <div className="grid gap-3">
              {content.navbar.menu.map((label) => {
                const href = toHref(label);
                const Icon = iconMap[label as MenuLabel] ?? Star;
                const active = pathname === href;
                return (
                  <Link key={label} href={href} onClick={() => setOpen(false)} className={`pill ${active ? "active" : ""}`}>
                    <Icon className="h-4.5 w-4.5" />
                    {label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-6">
              <a href={content.navbar.cta_link} target="_blank" className="pill cta w-full justify-center inline-flex items-center gap-2">
                <MessageCircle className="h-4.5 w-4.5" />
                {content.navbar.cta_text}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
