// app/courses/[slug]/view.client.tsx
"use client";

import { useEffect, useState } from "react";
import CourseUnlockModal, { isCourseUnlocked } from "@/components/CourseUnlockModal";

export default function ClientDetail({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);

  // bind ปุ่มที่มี data-buy-trigger ใน DOM ส่วนบน
  useEffect(() => {
    const btns = Array.from(
      document.querySelectorAll<HTMLButtonElement>("[data-buy-trigger]")
    );
    const handler = (e: Event) => {
      e.preventDefault();
      setOpen(true);
    };
    btns.forEach((b) => b.addEventListener("click", handler));
    return () => btns.forEach((b) => b.removeEventListener("click", handler));
  }, []);

  return (
    <CourseUnlockModal
      slug={slug}
      title={title}
      open={open}
      onClose={() => setOpen(false)}
      onUnlocked={() => {
        // หลังปลดล็อก: เปลี่ยนไอคอน/ข้อความในบทเรียนได้ตามต้องการ
        // (ตัวอย่างนี้เราปล่อยไว้เพราะแสดงไอคอนล็อกแบบคงที่)
      }}
    />
  );
}

// ปุ่ม Action เล็ก ๆ เผื่อวางซ้ำได้หลายจุด
ClientDetail.Action = function Action({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    setUnlocked(isCourseUnlocked(slug));
  }, [slug]);

  return unlocked ? (
    <div className="mt-3 text-sm text-emerald-400">
      ปลดล็อกแล้ว — เริ่มเรียนได้เลย
    </div>
  ) : (
    <p className="mt-3 text-sm opacity-80">
      *ทุกบทเรียนถูกล็อกไว้ กรุณากด “ซื้อคอร์สนี้” เพื่อใส่รหัสก่อนเริ่มเรียน
    </p>
  );
};