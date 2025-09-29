// components/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Facebook, Youtube, Globe } from "lucide-react";

/** ไอคอน LINE แบบเวคเตอร์ */
function LineIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden {...props}>
      <path d="M39.6 8.4C36.8 5.6 32.6 4 28 4H20C11.2 4 4 10 4 17.6c0 5.5 3.9 10.2 9.6 12.5-.2.8-1.2 4.4-1.3 5-.2.9.3 1.1 1 1 .8-.1 5.1-3.4 5.9-3.9 2.4.4 4.8.5 7.3.2 8.8-1.2 15.5-7.9 15.5-15.8 0-4.3-1.8-7.9-5.4-10.2z" />
    </svg>
  );
}

/* ===== CMS types (optionals) ===== */
type CmsSiteSettings = {
  footer?: {
    logoUrl?: string;
    socials?: {
      facebook?: string;
      line?: string;
      youtube?: string;
      website?: string;
    };
    menu?: { label: string; href: string; external?: boolean }[];
  };
};

/* ===== App defaults (fallback) ===== */
const FALLBACK_LOGO = "/logo-footer.png"; // คุณสามารถอัปเดตรูปนี้เองได้
const FALLBACK_SOCIALS = {
  facebook: "https://www.facebook.com/LongTradeAcademy",
  line: "https://lin.ee/oqfUFhG",
  youtube: "https://www.youtube.com/@AcademyLongtrade",
  website: "https://longtrade-academy.com/",
};
const FALLBACK_MENU: Array<{ label: string; href: string; external?: boolean }> = [
  { label: "หน้าหลัก", href: "/" },
  { label: "อินดิเคเตอร์", href: "/indicators" },
  { label: "EA", href: "/ea" },
  { label: "คอร์สเรียน", href: "/courses" },
  { label: "บทความ", href: "/articles" },
  { label: "โปรโมชั่น", href: "/promo" },
  { label: "สั่งซื้อ/สอบถาม", href: "https://line.me/ti/p/~longtrade", external: true },
];

export default function Footer({
  year = new Date().getFullYear(),
}: { year?: number }) {
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

  const logoSrc = cms?.footer?.logoUrl || FALLBACK_LOGO;
  const socials = { ...FALLBACK_SOCIALS, ...(cms?.footer?.socials || {}) };
  const menu = useMemo(() => {
    const m = cms?.footer?.menu;
    return (m && m.length) ? m : FALLBACK_MENU;
  }, [cms]);

  return (
    <footer
      className="
        relative mt-16 border-t border-white/10
        bg-black/30 backdrop-blur-sm text-white/85
      "
      aria-labelledby="site-footer"
    >
      {/* glow + texture */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_15%_0%,rgba(225,29,72,.14),transparent_60%),radial-gradient(60%_55%_at_85%_100%,rgba(244,63,94,.16),transparent_65%)]" />

      <div className="container-narrow px-6 py-12">
        <h2 id="site-footer" className="sr-only">ส่วนท้ายเว็บไซต์</h2>

        {/* Logo on top */}
        <div className="flex items-center justify-center">
          <div className="relative h-12 w-[220px]">
            <Image
              src={logoSrc}
              alt="Longtrade Academy"
              fill
              sizes="220px"
              className="object-contain drop-shadow"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          </div>
        </div>

        {/* Social (center, outlined circles) */}
        <ul className="mt-6 flex items-center justify-center gap-4">
          <Social href={socials.facebook} label="Facebook">
            <Facebook className="h-5 w-5" />
          </Social>
          <Social href={socials.line} label="LINE">
            <LineIcon className="h-5 w-5" />
          </Social>
          <Social href={socials.youtube} label="YouTube">
            <Youtube className="h-5 w-5" />
          </Social>
          <Social href={socials.website} label="Website">
            <Globe className="h-5 w-5" />
          </Social>
        </ul>

        {/* Menu row */}
        <nav
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[15px]"
          aria-label="ลิงก์เมนูส่วนท้าย"
        >
          {menu.map((l) =>
            l.external ? (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-white/85 hover:text-white transition"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                className="font-medium text-white/85 hover:text-white transition"
              >
                {l.label}
              </Link>
            )
          )}
        </nav>

        {/* Copyright */}
        <div className="mt-5 text-center text-xs text-white/65">
          © {year} Longtrade Academy — All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

/** Social button (outlined circle) */
function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        className="
          group inline-flex h-11 w-11 items-center justify-center
          rounded-full border border-white/25
          bg-white/[0.03] hover:bg-white/[0.08]
          hover:border-white/40 transition
          shadow-[inset_0_0_0_1px_rgba(255,255,255,.02)]
        "
      >
        <span className="text-white/90 group-hover:text-white">{children}</span>
      </a>
    </li>
  );
}
