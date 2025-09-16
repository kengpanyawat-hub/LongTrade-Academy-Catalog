// components/UseCaseModal.tsx
"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import type { UseCase } from "@/data/usecases";

export default function UseCaseModal({
  item,
  onClose,
}: {
  item: UseCase | null;
  onClose: () => void;
}) {
  // ล็อกสกอร์ลพื้นหลังระหว่างเปิดโมดัล
  useEffect(() => {
    if (!item) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [item]);

  const steps = useMemo(() => item?.steps ?? [], [item]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-5"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          role="dialog" aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .98 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            // ขนาดคงที่: กว้างไม่เกิน 980px, สูงไม่เกิน 88vh และเลื่อนเฉพาะเนื้อหา
            className="modal-shell w-[min(980px,100%)] max-w-[980px] max-h-[88vh] overflow-hidden rounded-2xl grid grid-rows-[auto,1fr]"
          >
            {/* ปกด้านบน (ความสูงคงที่) */}
            <div className="relative w-full h-[220px] md:h-[260px]">
              <Image src={item.image} alt={item.title} fill className="object-cover" priority />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                className="absolute top-3 right-3 text-2xl leading-none opacity-80 hover:opacity-100"
                onClick={onClose} aria-label="ปิด"
              >×</button>
            </div>

            {/* เนื้อหา (scroll ภายใน) */}
            <div className="overflow-y-auto overscroll-contain scrollbar-thin px-6 md:px-8 py-6">
              {/* ชื่อเรื่อง + คำโปรย + แท็กเครื่องมือ */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold">{item.title}</h3>
                  <p className="opacity-80 mt-1">{item.summary}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tools.map((t) => (
                      <span key={t} className="pill">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ขั้นตอน/หัวข้อแบบกรอบ (เหมือนภาพตัวอย่าง) */}
              <ol className="mt-6 space-y-4">
                {steps.map((s, i) => (
                  <li key={i} className="relative glass p-4 md:p-5 rounded-xl border border-white/10">
                    <span className="absolute -left-[1px] top-0 bottom-0 w-[4px] rounded-l-xl bg-gradient-to-b from-brand/70 to-transparent" />
                    <div className="font-semibold mb-1">{i + 1}. {s.title}</div>
                    <ul className="list-disc ml-5 opacity-85 text-sm">
                      {s.bullets.map((b, k) => <li key={k}>{b}</li>)}
                    </ul>
                  </li>
                ))}
              </ol>

              {/* ตัวชี้วัด (ถ้ามี) */}
              {item.metrics?.length ? (
                <div className="glass p-4 md:p-5 mt-4 rounded-xl">
                  <div className="font-semibold mb-1">ตัวชี้วัดที่แนะนำ</div>
                  <ul className="list-disc ml-5 opacity-85 text-sm">
                    {item.metrics.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                </div>
              ) : null}

              {/* CTA */}
              {item.cta ? (
                <div className="pt-6">
                  <a href={item.cta.url} target="_blank" className="btn-line" rel="noreferrer">
                    {item.cta.text}
                  </a>
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
