// components/PromoSplit.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const IMAGE_BG =
  "https://ik.imagekit.io/pcqgvgpgi1/bg%20graph.jpg";

export default function PromoSplit() {
  return (
    <section className="container-narrow py-10 md:py-14">
      {/* ขอบไฮไลต์ด้านนอกบาง ๆ */}
      <div className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-rose-500/30 via-rose-400/10 to-transparent">
        {/* กล่อง glass */}
        <div
          className="
            relative grid md:grid-cols-2 items-center gap-6 md:gap-10 rounded-3xl
            bg-white/5 backdrop-blur-xl border border-white/10
          "
        >
          {/* glow แดงนุ่ม ๆ ด้านหลัง */}
          <div
            className="absolute -inset-24 -z-10 bg-rose-500/10 blur-3xl rounded-[40px]"
            aria-hidden
          />

          {/* ฝั่งข้อความ */}
          <div className="px-6 md:px-10 py-10 md:py-12">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
              เทรดแบบไม่ต้องเครียด
            </h2>

            <p className="mt-4 opacity-90 text-base md:text-lg">
              เปิดกราฟแล้วรู้ทันทีว่าต้องทำอะไร เครื่องมือของเราให้ทั้งโครงสร้างและสัญญาณที่ชัดเจน
            </p>

            <p className="mt-3 opacity-90">
              วันนี้รับ <span className="text-brand font-semibold">ส่วนลด 25%</span>{" "}
              เริ่มควบคุมอนาคตการเทรดของคุณ
            </p>

            <Link
              href="https://line.me/ti/p/~longtrade"
              className="
                mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3
                bg-gradient-to-b from-rose-500 to-rose-600 text-white font-semibold
                shadow-[0_10px_30px_rgba(244,63,94,.45)]
                hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-rose-300/60
              "
            >
              เริ่มใช้งานเลย <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* ฝั่งรูป */}
          <div className="relative min-h-[220px] md:h-full">
            <Image
              src={IMAGE_BG}
              alt="Background trading graph"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none"
            />
            {/* เงาไล่โทนให้ตัวหนังสือชัด */}
            <div
              className="
                absolute inset-0 pointer-events-none
                rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none
                bg-gradient-to-t md:bg-gradient-to-l
                from-black/50 via-black/10 to-transparent
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}
