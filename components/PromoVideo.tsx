// components/PromoVideo.tsx
"use client";

import { ArrowRight } from "lucide-react";

const VIDEO =
  "https://ik.imagekit.io/pcqgvgpgi1/playback-1.mp4";
const POSTER =
  "https://ik.imagekit.io/pcqgvgpgi1/bg%20graph.jpg";

export default function PromoVideo() {
  return (
    <section className="container-narrow py-10 md:py-14">
      {/* เส้นไฮไลต์ขอบนอกบาง ๆ */}
      <div className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-rose-500/30 via-rose-400/10 to-transparent">
        {/* กล่องหลักแบบกระจก */}
        <div className="relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-3 md:p-4">
          {/* glow แดงนุ่ม ๆ */}
          <div
            className="absolute -inset-24 -z-10 bg-rose-500/10 blur-3xl rounded-[40px]"
            aria-hidden
          />

          {/* วิดีโอ (อัตราส่วน 16:9) */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl">
            <video
              className="h-full w-full object-cover pointer-events-none select-none"
              src={VIDEO}
              poster={POSTER}
              playsInline
              autoPlay
              muted
              loop
              // ป้องกันการแสดงปุ่ม/ตัวเลือกบางอย่างในบางเบราว์เซอร์
              controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
              disablePictureInPicture
              // @ts-expect-error: บางเบราว์เซอร์/ชนิดยังไม่มีใน type definition
              disableRemotePlayback
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>

          {/* ปุ่ม CTA */}
          <div className="mt-6 flex justify-center">
            <a
              href="https://line.me/ti/p/~longtrade"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3
                         bg-gradient-to-b from-rose-500 to-rose-600 text-white font-semibold
                         shadow-[0_10px_30px_rgba(244,63,94,.45)] hover:brightness-110
                         focus:outline-none focus:ring-2 focus:ring-rose-300/60"
            >
              Activate Discount <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* ซ่อน UI ควบคุมของบางเอนจินแบบบังคับ */}
      <style jsx global>{`
        /* WebKit (Chrome/Safari/iOS) */
        video::-webkit-media-controls {
          display: none !important;
          -webkit-appearance: none;
        }
        video::-webkit-media-controls-enclosure {
          display: none !important;
        }
        video::-webkit-media-controls-panel {
          display: none !important;
        }
      `}</style>
    </section>
  );
}
