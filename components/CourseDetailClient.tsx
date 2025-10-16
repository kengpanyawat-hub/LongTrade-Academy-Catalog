// components/CourseDetailClient.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Course } from "@/data/courses";
import Image from "next/image";

/* ===== SVG Icons (ขนาดเล็ก น้ำหนักเบา) ===== */
const LockIcon = (p: any) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
    <path
      d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12v10H6V10z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const PlayIcon = (p: any) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
    <path d="M8 5v14l11-7-11-7z" fill="currentColor" />
  </svg>
);
const CheckIcon = (p: any) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
    <path
      d="M20 6L9 17l-5-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ===== Helpers ===== */
const lsKeyUnlock = (slug: string) => `unlock:${slug}`;
const lsKeyDone = (slug: string, lessonId: string) => `done:${slug}:${lessonId}`;

type Props = { course: Course };

export default function CourseDetailClient({ course }: Props) {
  const [code, setCode] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ป้องกัน hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // อ่านสถานะปลดล็อกหลัง mounted เพื่อให้ UI ตรงกับ client เสมอ
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    if (!mounted) return;
    setUnlocked(localStorage.getItem(lsKeyUnlock(course.slug)) === "1");
  }, [mounted, course.slug]);

  // รวมทุกบทเรียนจากทุก section
  const allLessons = useMemo(
    () => course.sections.flatMap((s) => s.lessons),
    [course]
  );
  const totalLessons = allLessons.length;

  const doneCount = useMemo(() => {
    if (typeof window === "undefined") return 0;
    return allLessons.reduce(
      (n, ls) =>
        n + (localStorage.getItem(lsKeyDone(course.slug, ls.id)) ? 1 : 0),
      0
    );
  }, [course, unlocked, allLessons]);

  const allDone = unlocked && doneCount === totalLessons;

  const tryUnlock = () => {
    const expected = (course.unlockCode || "").trim();
    if (code.trim() && expected && code.trim() === expected) {
      setUnlocked(true);
      localStorage.setItem(lsKeyUnlock(course.slug), "1");
      setShowModal(false);
    } else {
      alert("โค้ดไม่ถูกต้อง");
    }
  };

  const toggleDone = (lessonId: string) => {
    const key = lsKeyDone(course.slug, lessonId);
    const now = localStorage.getItem(key);
    if (now) localStorage.removeItem(key);
    else localStorage.setItem(key, "1");
    // กระตุ้น re-render เบาๆ
    setCode((s) => s);
  };

  // รองรับ instructor.avatar แบบไม่ชน type เดิม
  const avatar = (course as any)?.instructor?.avatar as string | undefined;

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT */}
      <div className="lg:col-span-8 space-y-6">
        <div className="glass rounded-2xl p-5 border border-white/10">
          <div className="text-white/90">{course.intro}</div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/70">
            <span className="inline-flex items-center gap-2">
              <PlayIcon /> {course.hours}
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckIcon />
              {mounted ? (
                <span>{doneCount}</span>
              ) : (
                <span suppressHydrationWarning>0</span>
              )}
              /{totalLessons} บทเรียน
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            {avatar ? (
              <Image
                src={avatar}
                alt={course.instructor.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover ring-1 ring-white/20"
                priority
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-white/10 grid place-items-center border border-white/10">
                {course.instructor.name.slice(0, 1)}
              </div>
            )}
            <div>
              <div className="font-semibold">{course.instructor.name}</div>
              <div className="text-xs text-white/70">{course.instructor.role}</div>
            </div>
          </div>
        </div>

        {/* รายการบทเรียน */}
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-5 py-3 bg-white/5 font-semibold">เนื้อหาในคอร์ส</div>
          <div className="divide-y divide-white/10">
            {course.sections.map((sec) => (
              <details key={sec.id} open className="bg-white/[0.02]">
                <summary className="px-5 py-3 cursor-pointer select-none font-medium">
                  {sec.title}
                </summary>

                <ul className="px-4 pb-3 space-y-2">
                  {sec.lessons.map((ls) => {
                    const done =
                      typeof window !== "undefined" &&
                      !!localStorage.getItem(lsKeyDone(course.slug, ls.id));

                    const row = (
                      <div className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2 bg-black/20">
                        <div className="flex items-center gap-3">
                          {!unlocked ? (
                            <LockIcon className="text-white/60" />
                          ) : (
                            <PlayIcon className="text-emerald-400" />
                          )}
                          <span className="text-sm">{ls.title}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-white/60">{ls.duration}</span>
                          {unlocked && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleDone(ls.id);
                              }}
                              className={`rounded-lg px-2 py-1 text-xs border ${
                                done
                                  ? "bg-emerald-600/30 border-emerald-400 text-emerald-200"
                                  : "bg-white/5 border-white/15"
                              }`}
                              title={
                                done ? "ยกเลิกทำเครื่องหมาย" : "ทำเครื่องหมายว่าเรียนจบ"
                              }
                            >
                              {done ? "✓ เรียนจบ" : "ทำเครื่องหมายเพื่อเริ่มเรียน"}
                            </button>
                          )}
                        </div>
                      </div>
                    );

                    // ป้องกัน Hydration: SSR เป็น <div>, หลัง mounted & unlocked ค่อยเป็น <Link>
                    return (
                      <li key={ls.id}>
                        {mounted && unlocked ? (
                          <Link
                            href={`/courses/${course.slug}/learn/${ls.id}`}
                            className="block hover:bg-white/[0.04] rounded-xl transition"
                          >
                            {row}
                          </Link>
                        ) : (
                          row
                        )}
                      </li>
                    );
                  })}
                </ul>
              </details>
            ))}
          </div>

          {/* แถบปลดล็อกเมื่อยังไม่ปลด */}
          {!unlocked && (
            <div className="p-4 border-t border-white/10 bg-gradient-to-r from-black/30 to-red-900/20">
              <div className="text-sm text-white/80 mb-2">
                เนื้อหาถูกล็อกไว้ กรุณาใส่รหัสคอร์สเพื่อเริ่มเรียน
              </div>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="กรอกรหัสคอร์ส"
                  className="flex-1 rounded-xl bg-black/40 border border-white/15 px-3 py-2 outline-none"
                />
                <button
                  onClick={tryUnlock}
                  className="rounded-xl px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  เริ่มเรียน
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ปุ่มไปหน้าแบบทดสอบ */}
        {allDone && (
          <div className="glass rounded-2xl p-4 border border-white/10 flex items-center justify-between">
            <div>
              <div className="font-semibold">ทดสอบหลังเรียน</div>
              <div className="text-white/70 text-sm">
                เมื่อทำแบบทดสอบผ่าน จะสามารถขอรับ Certificate จาก Longtrade Academy
              </div>
            </div>
            <Link
              href={`/courses/${course.slug}/quiz`}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 font-semibold"
            >
              ทำแบบทดสอบ
            </Link>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <aside className="lg:col-span-4">
        <div className="rounded-2xl border border-white/10 p-5 glass">
          <div className="text-3xl font-extrabold">
            ฿{course.price.toLocaleString()}
          </div>
          {course.originalPrice && (
            <div className="text-sm text-white/60 line-through">
              ฿{course.originalPrice.toLocaleString()}
            </div>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="mt-4 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 font-semibold text-white"
          >
            ซื้อคอร์สนี้ / เริ่มเรียน
          </button>

          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <CheckIcon /> รวม {totalLessons} บทเรียน
            </li>
            <li className="flex items-center gap-2">
              <PlayIcon /> เวลารวม {course.hours}
            </li>
            <li className="flex items-center gap-2">
              <LockIcon /> ปลดล็อกด้วยรหัสคอร์ส
            </li>
          </ul>
        </div>
      </aside>

      {/* MODAL ใส่รหัส */}
      {showModal && (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-black/60 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm opacity-70">คอร์ส</div>
                <div className="text-xl font-bold">{course.title}</div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl leading-none opacity-80 hover:opacity-100"
                aria-label="ปิด"
              >
                ×
              </button>
            </div>

            <div className="mt-4">
              <label className="text-sm opacity-80">กรอกรหัสคอร์ส</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="เช่น FS-2025-OK"
                className="mt-1 w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2 outline-none"
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={tryUnlock}
                  className="rounded-xl px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  ยืนยันรหัสเพื่อเริ่มเรียน
                </button>
                <a
                  href="https://line.me/ti/p/~longtrade"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/15"
                >
                  ติดต่อ/สั่งซื้อ (LINE)
                </a>
              </div>

              <div className="mt-4 text-xs text-white/60">
                หากยังไม่มีโค้ด ให้กดปุ่ม “ติดต่อ/สั่งซื้อ (LINE)” เพื่อรับโค้ด
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
