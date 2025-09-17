<<<<<<< HEAD
"use client";

import Link from "next/link";

export default function RedCta({
  title = "เข้าร่วมกับ",
  highlight = "10,000+ เทรดเดอร์",
  subtitle = "",
  buttonText = "รับสิทธิ์ส่วนลด 25% ตอนนี้",
  href = "/contact", // เปลี่ยนเป็นลิงก์ที่ต้องการ เช่น LINE หรือหน้าสั่งซื้อ
}: {
  title?: string;
  highlight?: string;
  subtitle?: string;
  buttonText?: string;
  href?: string;
}) {
  return (
    <section className="container-narrow py-10 md:py-14">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0c]">
        {/* ชั้นเอฟเฟกต์พื้นหลัง */}
        <div className="pointer-events-none absolute inset-0">
          {/* grid เส้นบาง ๆ */}
          <div className="absolute inset-0 opacity-20 [background:
            repeating-linear-gradient(0deg,rgba(255,255,255,.08)_0,rgba(255,255,255,.08)_1px,transparent_1px,transparent_42px),
            repeating-linear-gradient(90deg,rgba(255,255,255,.06)_0,rgba(255,255,255,.06)_1px,transparent_1px,transparent_42px)
          ]" />
          {/* glow ด้านบน */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(900px_380px_at_50%_-10%,rgba(255,60,60,.35),transparent_65%)]" />
          {/* ไล่สีแดงด้านล่าง */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-rose-600/60 via-rose-500/25 to-transparent" />
        </div>

        {/* เนื้อหา */}
        <div className="relative px-6 md:px-10 py-12 md:py-16 text-center">
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {title}{" "}
            <span className="inline-block rounded-xl bg-white/5 px-3 py-1 ring-2 ring-white/20 backdrop-blur">
              {highlight}
            </span>
          </h3>

          {subtitle ? (
            <p className="mt-3 text-base md:text-lg opacity-80">{subtitle}</p>
          ) : null}

          <Link
            href={href}
            className="mt-8 inline-flex items-center justify-center rounded-full px-6 md:px-8 py-3 text-base md:text-lg font-semibold
                       bg-gradient-to-r from-rose-500 via-rose-600 to-red-700
                       shadow-[0_10px_30px_-10px_rgba(244,63,94,.65)]
                       hover:brightness-110 active:translate-y-[1px] transition"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
=======
// components/RedCta.tsx
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

type RedCtaProps = {
  // รองรับสองชุดชื่อ prop
  title?: string;          // = headline
  headline?: string;

  subtitle?: string;       // = sub
  sub?: string;

  buttonText?: string;     // = button
  button?: string;

  highlight?: string;      // ข้อความเน้นย้ำ (ออปชัน)
  href: string;            // ลิงก์ปุ่ม
  className?: string;      // เผื่ออยากส่งคลาสเพิ่ม (ออปชัน)
};

export default function RedCta(props: RedCtaProps) {
  const {
    title,
    headline,
    subtitle,
    sub,
    buttonText,
    button,
    highlight,
    href,
    className,
  } = props;

  const h1 = (headline ?? title ?? "").trim();
  const subtext = (sub ?? subtitle ?? "").trim();
  const btn = (button ?? buttonText ?? "เริ่มใช้งานเลย").trim();

  return (
    <section className="container-narrow my-12 px-4">
      <div
        className={
          "relative overflow-hidden rounded-3xl border border-white/10 " +
          "bg-black/30 backdrop-blur-xl p-8 text-center " +
          (className ?? "")
        }
      >
        {/* แสงโทนแดง */}
        <div className="pointer-events-none absolute inset-0
                        bg-[radial-gradient(90%_140%_at_50%_-10%,rgba(244,63,94,.35),transparent)]" />

        <h3 className="relative text-3xl md:text-4xl font-extrabold">
          {h1}
          {highlight ? (
            <>
              {" "}
              <span
                className="align-middle px-1 rounded-md
                           bg-gradient-to-tr from-rose-500/20 to-transparent
                           ring-1 ring-rose-400/30"
              >
                {highlight}
              </span>
            </>
          ) : null}
        </h3>

        {subtext ? (
          <p className="relative mt-3 opacity-85">{subtext}</p>
        ) : null}

        <Link
          href={href}
          className="relative inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full
                     bg-rose-600 hover:bg-rose-500 text-white font-semibold
                     shadow-lg shadow-rose-600/30"
        >
          {btn} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
>>>>>>> 16a93de (fix(video): add types for controlsList/pictureInPicture + remove ts-expect-error)
