/* components/VideoPlayer.tsx */
"use client";

type Props = {
  src: string;        // อาจเป็นไฟล์ .mp4/.webm, ลิงก์ YouTube หรือ YouTube ID
  poster?: string;
  className?: string;
};

/** ตรวจว่าข้อความดูเหมือน YouTube ID มั้ย (ความยาว 11 ตัวอักษร) */
function looksLikeYouTubeId(s: string) {
  return /^[A-Za-z0-9_-]{11}$/.test(s);
}

/** แยก YouTube ID ออกจาก URL/ID ที่รับมา */
function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();

  if (looksLikeYouTubeId(trimmed)) return trimmed;

  // รูปแบบลิงก์ที่พบบ่อย
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/, // https://youtu.be/ID
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/, // https://www.youtube.com/watch?v=ID
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/, // https://www.youtube.com/embed/ID
    /youtube-nocookie\.com\/embed\/([A-Za-z0-9_-]{11})/,
  ];

  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}

/** ตรวจว่าเป็นไฟล์วิดีโอทั่วไปมั้ย (mp4/webm/ogg ฯลฯ) */
function looksLikeFileVideo(src: string) {
  return /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i.test(src);
}

export default function VideoPlayer({ src, poster, className }: Props) {
  const ytId = extractYouTubeId(src);
  const isFileVideo = looksLikeFileVideo(src);

  // --- กรณี YouTube: ใช้ iframe ที่ youtube-nocookie ---
  if (ytId && !isFileVideo) {
    const embed = `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&playsinline=1`;

    return (
      <div className={className}>
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black"
          style={{ aspectRatio: "16 / 9" }}
        >
          <iframe
            key={ytId}
            src={embed}
            title="Course video"
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="origin-when-cross-origin"
          />
        </div>
      </div>
    );
  }

  // --- ค่าเริ่มต้น/ไฟล์วิดีโอทั่วไป: ใช้ <video> แบบเดิม ---
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
