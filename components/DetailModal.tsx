// components/DetailModal.tsx
"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Clipboard, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { CatalogItem, PopupSection, PopupBody } from "@/data/types";

// Fallback: ถ้าไม่ได้ใส่ sections ใน data ให้ดึงจาก popup.body เดิม
function buildSections(item: CatalogItem): ReadonlyArray<PopupSection> {
  if (item.popup?.sections?.length) return item.popup.sections!;

  const bodies: ReadonlyArray<PopupBody> =
    (item.popup?.body ?? []) as ReadonlyArray<PopupBody>;

  // แปลง text เป็น bullets โดยแยกจากขึ้นบรรทัด/จุด/อักษรนำหน้า
  const splitter = /\n+|•|·|;|—|–|-{1}\s/g;
  const sections = bodies.map((b) => {
    const raw = b.text?.trim() ?? "";
    const parts = raw.split(splitter).map((s) => s.trim()).filter(Boolean);
    return { title: b.heading, items: parts.length ? parts : [raw] };
  });
  return sections;
}

// Markdown (ออปชัน) สำหรับปุ่มคัดลอกแผน
function toMarkdown(item: CatalogItem, secs: ReadonlyArray<PopupSection>) {
  const head = `# ${item.title}\n\n${item.popup?.intro || item.summary}\n`;
  const tags = item.tags?.length ? `\n**Tags:** ${item.tags.join(", ")}\n` : "";
  const steps = secs
    .map((s, i) => `\n### ${i + 1}. ${s.title}\n- ${s.items.join("\n- ")}`)
    .join("");
  const metrics = item.popup?.metrics?.length
    ? `\n\n**Metrics**\n- ${item.popup.metrics.join("\n- ")}`
    : "";
  return head + tags + steps + metrics;
}

export default function DetailModal({
  item,
  onClose,
}: {
  item: CatalogItem | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const sections = useMemo(() => (item ? buildSections(item) : []), [item]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="modal-shell w-full max-w-4xl overflow-hidden"
          >
            {/* Header image */}
            <div className="relative w-full h-[220px] md:h-[260px]">
              <Image src={item.cover} alt={item.title} fill className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                className="absolute top-3 right-3 text-2xl leading-none opacity-80 hover:opacity-100"
                onClick={onClose}
                aria-label="ปิด"
              >
                ×
              </button>
            </div>

            {/* Scrollable body */}
            <div className="max-h-[85vh] overflow-y-auto">
              <div className="p-6 md:p-8">
                {/* Title + intro + tags + action */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold">{item.title}</h3>
                    <p className="opacity-80 mt-1">
                      {item.popup?.intro || item.summary}
                    </p>
                    {item.tags?.length ? (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.tags.map((t) => (
                          <span key={t} className="pill">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {/* คัดลอกแผน (ออปชัน) */}
                  <button
                    className="glass px-3 py-2 rounded-lg inline-flex items-center gap-2"
                    onClick={async () => {
                      await navigator.clipboard.writeText(toMarkdown(item, sections));
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1400);
                    }}
                    title="คัดลอก Playbook เป็น Markdown"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-brand" />
                    ) : (
                      <Clipboard className="w-4 h-4" />
                    )}
                    {copied ? "คัดลอกแล้ว" : "คัดลอกแผน"}
                  </button>
                </div>

                {/* Sections list */}
                <ol className="mt-6 space-y-4">
                  {sections.map((s, i) => (
                    <li
                      key={i}
                      className="glass p-4 border border-white/10 rounded-xl relative"
                    >
                      <div className="absolute -left-[1px] top-0 bottom-0 w-[4px] bg-gradient-to-b from-brand/70 to-transparent rounded-l-xl" />
                      <div className="font-semibold mb-1">
                        {i + 1}. {s.title}
                      </div>
                      <ul className="list-disc ml-5 opacity-85 text-sm">
                        {s.items.map((b, k) => (
                          <li key={k}>{b}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>

                {/* Metrics (ถ้ามี) */}
                {item.popup?.metrics?.length ? (
                  <div className="glass p-4 mt-4">
                    <div className="font-semibold mb-1">ตัวชี้วัดที่แนะนำ</div>
                    <ul className="list-disc ml-5 opacity-85 text-sm">
                      {item.popup.metrics.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {/* CTA LINE */}
                <div className="pt-6">
                  <a
                    href="https://line.me/ti/p/~longtrade"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-line"
                  >
                    LINE สั่งซื้อ/สอบถาม
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
