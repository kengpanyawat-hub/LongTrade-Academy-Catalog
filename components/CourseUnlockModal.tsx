// components/CourseUnlockModal.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

// ตั้งรหัสสำหรับแต่ละ slug ที่นี่ หรือใช้ ENV ก็ได้
// เช่น NEXT_PUBLIC_COURSE_CODES='{"fullstack-masterclass":"FS-2025","python-data-science":"PY-2025"}'
const ENV_OVERRIDES =
  (process.env.NEXT_PUBLIC_COURSE_CODES &&
    safeJSON<Record<string, string>>(process.env.NEXT_PUBLIC_COURSE_CODES)) ||
  null;
function safeJSON<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

const DEFAULT_CODES: Record<string, string> = {
  "fullstack-masterclass": "FS-2025",
  "python-data-science": "PY-2025",
};

function getCode(slug: string) {
  if (ENV_OVERRIDES && ENV_OVERRIDES[slug]) return ENV_OVERRIDES[slug];
  return DEFAULT_CODES[slug] || "DEMO-0000";
}

export default function CourseUnlockModal({
  slug,
  title,
  open,
  onClose,
  onUnlocked,
}: {
  slug: string;
  title: string;
  open: boolean;
  onClose: () => void;
  onUnlocked: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const storageKey = useMemo(() => `course-unlock:${slug}`, [slug]);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => input.current?.focus(), 30);
    return () => clearTimeout(id);
  }, [open]);

  const submit = async () => {
    const value = input.current?.value?.trim() || "";
    if (!value) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 300)); // เลียนแบบ network เล็กน้อย

    if (value === getCode(slug)) {
      localStorage.setItem(storageKey, "unlocked");
      onUnlocked();
      onClose();
    } else {
      alert("รหัสไม่ถูกต้อง ลองอีกครั้งหรือกดปุ่มติดต่อเพื่อขอรหัสครับ");
    }
    setLoading(false);
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] grid place-items-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8 relative"
      >
        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-[radial-gradient(60%_50%_at_10%_10%,rgba(255,0,0,.18),transparent_70%),radial-gradient(60%_50%_at_90%_90%,rgba(255,70,70,.22),transparent_70%)]" />

        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl md:text-3xl font-extrabold">
            กรอกรหัสเพื่อเริ่มเรียน
          </h3>
          <button
            onClick={onClose}
            className="text-2xl leading-none opacity-80 hover:opacity-100"
            aria-label="ปิด"
          >
            ×
          </button>
        </div>

        <p className="opacity-80 mt-2">
          คอร์ส: <span className="font-semibold">{title}</span>
        </p>

        <div className="mt-5 grid gap-3">
          <input
            ref={input}
            className="w-full rounded-xl px-4 py-3 bg-black/40 border border-white/15 outline-none"
            placeholder="ใส่รหัสคอร์ส เช่น FS-2025"
          />

          <div className="text-sm text-white/70 -mt-1">
            หากยังไม่มีโค้ด ให้กดปุ่ม “ติดต่อ/สั่งซื้อ” เพื่อรับรหัสเรียน
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            <button
              onClick={submit}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-[0_8px_28px_rgba(244,63,94,.35)] transition"
            >
              {loading ? "กำลังตรวจสอบ…" : "เริ่มเรียน"}
            </button>

            <a
              href="https://line.me/ti/p/~longtrade"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 bg-white/10 hover:bg-white/15 border border-white/10 transition"
            >
              ติดต่อ/สั่งซื้อ (LINE)
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function isCourseUnlocked(slug: string) {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`course-unlock:${slug}`) === "unlocked";
}
