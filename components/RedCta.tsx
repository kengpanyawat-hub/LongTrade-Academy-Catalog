"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

type RedCtaProps = {
  title: string;           // ข้อความก่อน highlight เช่น "เข้าร่วมกับ"
  highlight?: string;      // ข้อความที่อยากเน้น เช่น "10,000+ เทรดเดอร์"
  subtitle?: string;       // บรรทัดถัดไป / คำอธิบาย
  buttonText?: string;     // ข้อความปุ่ม
  href?: string;           // ลิงก์ของปุ่ม
  image?: string;          // รูปฝั่งขวา (ถ้ามี)
  alt?: string;            // alt ของรูป
  className?: string;      // เผื่ออยากเพิ่มคลาสจากภายนอก
};

export default function RedCta({
  title,
  highlight,
  subtitle,
  buttonText = "เริ่มใช้งานเลย",
  href = "#",
  image,
  alt = "illustration",
  className,
}: RedCtaProps) {
  return (
    <section
      className={clsx(
        "relative overflow-hidden rounded-3xl p-8 md:p-12",
        "bg-white/[0.04] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]",
        "backdrop-blur-sm",
        className
      )}
    >
      {/* red glow */}
      <div className="pointer-events-none absolute -inset-20 bg-[radial-gradient(60%_50%_at_10%_10%,rgba(255,0,0,.18),transparent_70%),radial-gradient(60%_50%_at_90%_90%,rgba(255,70,70,.22),transparent_70%)]" />

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Texts */}
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
            {title}{" "}
            {highlight ? (
              <span className="text-rose-400 drop-shadow-[0_0_14px_rgba(244,63,94,.45)]">
                {highlight}
              </span>
            ) : null}
          </h2>

          {subtitle ? (
            <p className="mt-3 text-white/80">{subtitle}</p>
          ) : null}

          <Link
            href={href}
            className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3
                       bg-rose-500 hover:bg-rose-400 text-white font-semibold
                       shadow-[0_6px_30px_rgba(244,63,94,.35)] transition"
          >
            {buttonText}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Image (optional) */}
        <div className="relative h-48 md:h-64">
          {image ? (
            <Image
              src={image}
              alt={alt}
              fill
              className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,.35)]"
              sizes="(min-width: 768px) 40vw, 80vw"
              priority
            />
          ) : (
            <div className="h-full w-full rounded-2xl bg-gradient-to-br from-rose-700/40 to-rose-400/20 border border-white/10" />
          )}
        </div>
      </div>
    </section>
  );
}
