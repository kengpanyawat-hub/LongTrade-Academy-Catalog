// components/CourseDetailClient.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Course } from "@/data/courses";

/* ===== SVG Icons ===== */
const LockIcon = (p: any) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
    <path d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12v10H6V10z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const PlayIcon = (p: any) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
    <path d="M8 5v14l11-7-11-7z" fill="currentColor"/>
  </svg>
);
const CheckIcon = (p: any) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
    <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ===== Helpers ===== */
const lsKeyUnlock = (slug: string) => `unlock:${slug}`;
const lsKeyDone = (slug: string, lessonId: string) => `done:${slug}:${lessonId}`;

type Props = { course: Course };

export default function CourseDetailClient({ course }: Props) {
  const [code, setCode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [err, setErr] = useState<string>("");
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(lsKeyUnlock(course.slug)) === "1";
  });

  // รวมทุกบทเรียนจากทุก section
  const allLessons = useMemo(
    () => course.sections.flatMap((s) => s.lessons),
    [course]
  );
  const totalLessons = allLessons.length;

  const doneCount = useMemo(() => {
    if (typeof window === "undefined") return 0;
    return allLessons.reduce(
      (n, ls) => n + (localStorage.getItem(lsKeyDone(course.slug, ls.id)) ? 1 : 0),
      0
    );
  }, [course, unlocked, allLessons]);

  const allDone = unlocked && doneCount === totalLessons;

  const tryUnlock = () => {
    setErr("");
    const expected = (course.unlockCode || "").trim();
    const val = code.trim();
    if (!val) {
      setErr("กรุณากรอกรหัสคอร์ส");
      return;
    }
    if (expected && val === expected) {
      setUnlocked(true);
      localStorage.setItem(lsKeyUnlock(course.slug), "1");
      setShowModal(false);
    } else {
      setErr("โค้ดไม่ถูกต้อง – ตรวจสอบอีกครั้งหรือกดปุ่ม LINE เพื่อขอรับโค้ด");
    }
  };

  const toggleDone = (lessonId: string) => {
    const key = lsKeyDone(course.slug, lessonId);
    const now = localStorage.getItem(key);
    if (now) localStorage.removeItem(key);
    else localStorage.setItem(key, "1");
    // กระตุ้น re-render เล็กน้อย
    setCode((s) => s);
  };

  // ปิด modal ด้วย ESC และยืนยันด้วย Enter
  useEffect(() => {
    if (!showModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
      if (e.key === "Enter") tryUnlock();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal, code]);

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT */}
      <div className="lg:col-span-8 space-y-6">
        <div className="glass rounded-2xl p-5 border border-white/10">
          <div className="text-white/90">{course.intro}</div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/70">
            <span className="inline-flex items-center gap-2"><PlayIcon /> {course.hours}</span>
            <span className="inline-flex items-center gap-2"><CheckIcon /> {doneCount}/{totalLessons} บทเรียน</span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/10 grid place-items-center border border-white/10">
              {course.instructor.name.slice(0, 1)}
            </div>
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
                <summary className="px-5 py-3 cursor-pointer select-none font-medium">{sec.title}</summary>
                <ul className="px-4 pb-3 space-y-2">
                  {sec.lessons.map((ls) => {
                    const done = typeof window !== "undefined" && !!localStorage.getItem(lsKeyDone(course.slug, ls.id));

                    const row = (
                      <div className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2 bg-black/20">
                        <div className="flex items-center gap-3">
                          {!unlocked ? <LockIcon className="text-white/60" /> : <PlayIcon className="text-emerald-400" />}
                          <span className="text-sm">{ls.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-white/60">{ls.duration}</span>
                          {unlocked && (
                            <button
                              onClick={(e) => { e.preventDefault(); toggleDone(ls.id); }}
                              className={`rounded-lg px-2 py-1 text-xs border ${
                                done ? "bg-emerald-600/30 border-emerald-400 text-emerald-200" : "bg-white/5 border-white/15"
                              }`}
                              title={done ? "ยกเลิกทำเครื่องหมาย" : "ทำเครื่องหมายว่าเรียนจบ"}
                            >
                              {done ? "✓ เรียนจบ" : "ทำเครื่องหมายจบ"}
                            </button>
                          )}
                        </div>
                      </div>
                    );

                    return (
                      <li key={ls.id}>
                        {!unlocked ? (
                          row
                        ) : (
                          <Link href={`/courses/${course.slug}/learn/${ls.id}`} className="block hover:bg-white/[0.04] rounded-xl transition">
                            {row}
                          </Link>
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
              <div className="text-sm text-white/80 mb-2">เนื้อหาถูกล็อกไว้ กรุณาใส่รหัสคอร์สเพื่อเริ่มเรียน</div>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="กรอกรหัสคอร์ส"
                  className="flex-1 rounded-xl bg-black/40 border border-white/15 px-3 py-2 outline-none"
                />
                <button onClick={tryUnlock} className="rounded-xl px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold">
                  เริ่มเรียน
                </button>
              </div>
              {err && <p className="mt-2 text-xs text-rose-300">{err}</p>}
            </div>
          )}
        </div>

        {/* ปุ่มไปหน้าแบบทดสอบ */}
        {allDone && (
          <div className="glass rounded-2xl p-4 border border-white/10 flex items-center justify-between">
            <div>
              <div className="font-semibold">ทดสอบหลังเรียน</div>
              <div className="text-white/70 text-sm">เมื่อทำแบบทดสอบผ่าน จะสามารถขอรับ Certificate จาก Longtrade Academy</div>
            </div>
            <Link href={`/courses/${course.slug}/quiz`} className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 font-semibold">
              ทำแบบทดสอบ
            </Link>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <aside className="lg:col-span-4">
        <div className="rounded-2xl border border-white/10 p-5 glass">
          <div className="text-3xl font-extrabold">฿{course.price.toLocaleString()}</div>
          {course.originalPrice && <div className="text-sm text-white/60 line-through">฿{course.originalPrice.toLocaleString()}</div>}

          <button onClick={() => setShowModal(true)} className="mt-4 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 font-semibold text-white">
            ซื้อคอร์สนี้ / เริ่มเรียน
          </button>

          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2"><CheckIcon /> รวม {totalLessons} บทเรียน</li>
            <li className="flex items-center gap-2"><PlayIcon /> เวลารวม {course.hours}</li>
            <li className="flex items-center gap-2"><LockIcon /> ปลดล็อกด้วยรหัสคอร์ส</li>
          </ul>
        </div>
      </aside>

      {/* ===== BEAUTIFIED MODAL ===== */}
      {showModal && (
        <div
          className="fixed inset-0 z-[120] grid place-items-center bg-black/70 backdrop-blur-sm p-4 modal-fade"
          onClick={() => setShowModal(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl relative rounded-2xl px-6 py-6 modal-card"
          >
            {/* Decorative glow border */}
            <div className="pointer-events-none absolute -inset-[1px] rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-white/0" />
            <div className="pointer-events-none absolute -inset-8 rounded-3xl modal-bg" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-white/60">คอร์ส</div>
                  <h3 className="text-xl md:text-2xl font-bold">{course.title}</h3>
                  <p className="text-white/70 text-sm mt-1">
                    กรอกรหัสเพื่อปลดล็อกเนื้อหาและเริ่มเรียนได้ทันที
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  aria-label="ปิด"
                  className="rounded-full h-9 w-9 grid place-items-center bg-white/10 hover:bg-white/15 border border-white/15 text-lg leading-none"
                >
                  ×
                </button>
              </div>

              <div className="mt-5">
                <label className="block text-sm text-white/80 mb-1">รหัสคอร์ส</label>
                <div className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setErr(""); }}
                    placeholder="เช่น FS-2025-OK"
                    className="flex-1 rounded-xl bg-black/50 border border-white/15 px-3 py-3 outline-none focus:border-white/30"
                  />
                  <button
                    onClick={tryUnlock}
                    className="rounded-xl px-4 md:px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-[0_8px_28px_rgba(244,63,94,.35)]"
                  >
                    ยืนยันรหัส
                  </button>
                </div>
                {err && <p className="mt-2 text-sm text-rose-300">{err}</p>}

                <div className="mt-4 flex items-center gap-3">
                  <a
                    href="https://line.me/ti/p/~longtrade"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15"
                  >
                    ติดต่อ/สั่งซื้อทาง LINE
                  </a>
                  <span className="text-xs text-white/60">
                    * หากยังไม่มีโค้ด ให้กดปุ่มเพื่อขอรับโค้ดจากทีมงาน
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal styles */}
          <style jsx>{`
            .modal-card {
              background:
                radial-gradient(120% 120% at 100% 0%, rgba(225,29,72,.18), transparent 60%),
                rgba(18,18,18,.92);
              box-shadow:
                0 10px 40px rgba(0,0,0,.5),
                inset 0 1px 0 rgba(255,255,255,.06);
            }
            .modal-bg {
              background:
                radial-gradient(60% 50% at 20% 10%, rgba(255,0,0,.35), transparent 65%),
                radial-gradient(60% 50% at 85% 95%, rgba(255,70,70,.28), transparent 65%);
              filter: blur(22px);
            }
            .modal-fade { animation: modal-fade .18s ease-out; }
            @keyframes modal-fade {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
