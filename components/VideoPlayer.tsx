/* components/VideoPlayer.tsx */
"use client";

type Props = {
  src: string;
  poster?: string;
  className?: string;
};

export default function VideoPlayer({ src, poster, className }: Props) {
  return (
    <div className={className}>
      <div className="relative w-full overflow-hidden rounded-2xl border border-white/10">
        <video
          src={src}
          poster={poster}
          className="block w-full h-auto"
          playsInline
          muted
          autoPlay
          loop
          // เปิด/ปิด controls ได้ตามต้องการ: ตอนนี้ซ่อนไว้
          controls={false}
          controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
          onContextMenu={(e) => e.preventDefault()}
          disablePictureInPicture
          aria-label="Indicator demo video"
        />
      </div>
    </div>
  );
}
