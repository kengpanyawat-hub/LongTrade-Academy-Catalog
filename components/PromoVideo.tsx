// components/PromoVideo.tsx
"use client";
import React from "react";

export default function PromoVideo() {
  return (
    <section className="container-narrow my-16 px-4">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-4 md:p-6">
        {/* แสงโทนแดง */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_140%_at_50%_-10%,rgba(244,63,94,.35),transparent)]" />

        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
          <video
            src="https://ik.imagekit.io/pcqgvgpgi1/goldflow.mp4"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
            disablePictureInPicture
            disableRemotePlayback
            onContextMenu={(e) => e.preventDefault()}
            className="h-full w-full object-cover"
            aria-label="Promo demo"
          />
        </div>
      </div>
    </section>
  );
}
