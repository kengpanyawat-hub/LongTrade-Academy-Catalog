// app/courses/[slug]/learn/[lessonId]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { courses } from "@/data/courses";
import Navbar from "@/components/Navbar";

/** localStorage keys */
const kUnlock = (slug: string) => `unlock:${slug}`;
const kDone = (slug: string, id: string) => `done:${slug}:${id}`;

export default function LessonPlayerPage() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const router = useRouter();

  const course = useMemo(() => courses.find((c) => c.slug === slug)!, [slug]);
  const flat = useMemo(
    () => course.sections.flatMap((s) => s.lessons),
    [course]
  );
  const index = flat.findIndex((l) => l.id === lessonId);
  const lesson = flat[index];

  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    // ตรวจปลดล็อก
    setUnlocked(typeof window !== "undefined" && localStorage.getItem(kUnlock(slug)) === "1");
  }, [slug]);

  // ติ๊ก “เรียนจบ” อัตโนมัติทันทีที่เข้าหน้านี้
  useEffect(() => {
    if (!lesson) return;
    if (typeof window === "undefined") return;
    localStorage.setItem(kDone(slug, lesson.id), "1");
  }, [slug, lesson]);

  if (!lesson) {
    return (
      <>
        <Navbar />
        <main className="container-narrow pt-28 pb-16">
          <p>ไม่พบเนื้อหาบทเรียน</p>
        </main>
      </>
    );
  }

  if (!unlocked) {
    return (
      <>
        <Navbar />
        <main className="container-narrow pt-28 pb-16">
          <h1 className="text-2xl font-bold">เนื้อหายังล็อกอยู่</h1>
          <p className="opacity-70 mt-2">
            กรุณากลับไปหน้าคอร์ส (<span className="font-medium">{course.title}</span>) และปลดล็อกด้วยรหัสก่อนนะครับ
          </p>
        </main>
      </>
    );
  }

  const prev = index > 0 ? flat[index - 1] : null;
  const next = index < flat.length - 1 ? flat[index + 1] : null;

  return (
    <>
      <Navbar />
      <main className="container-narrow pt-28 pb-16 space-y-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">{course.title}</h1>
        <div className="text-white/80">บทเรียน: {lesson.title}</div>

        {/* ฝัง YouTube (ไม่ต้องพึ่ง window.YT) */}
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/10">
          <div className="relative" style={{ paddingTop: "56.25%" }}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${lesson.youtubeId}?modestbranding=1&rel=0&iv_load_policy=3&fs=0&color=white`}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen={false}
              sandbox="allow-same-origin allow-scripts allow-presentation"
              title={lesson.title}
            />
          </div>
          {/* กันลาก/กันคลิกขวาบางส่วนรอบๆ */}
          <div className="pointer-events-none absolute inset-0" />
        </div>

        <div className="flex justify-between">
          <button
            disabled={!prev}
            onClick={() => prev && router.push(`/courses/${slug}/learn/${prev.id}`)}
            className="btn-ghost disabled:opacity-50"
          >
            ← บทก่อนหน้า
          </button>
          <button
            disabled={!next}
            onClick={() => next && router.push(`/courses/${slug}/learn/${next.id}`)}
            className="btn-red disabled:opacity-50"
          >
            บทถัดไป →
          </button>
        </div>

        {index === flat.length - 1 && (
          <div className="glass rounded-2xl p-5 border border-white/10">
            <div className="font-semibold">ทดสอบหลังเรียน</div>
            <p className="text-sm opacity-80 mt-1">
              เมื่อทำแบบทดสอบผ่าน จะสามารถขอรับ Certificate จาก Longtrade Academy
            </p>
            <button
              onClick={() => router.push(`/courses/${slug}/quiz`)}
              className="mt-3 btn-ghost"
            >
              ไปทำแบบทดสอบ
            </button>
          </div>
        )}
      </main>
    </>
  );
}
