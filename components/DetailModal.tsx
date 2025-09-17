// components/DetailModal.tsx
"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Share2, CheckCircle2, Link as LinkIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { CatalogItem, PopupSection, PopupBody } from "@/data/types";
import { useToast } from "@/components/Toast";

// สร้าง sections จากข้อมูลเดิม (รองรับ body เดิม)
function buildSections(item: CatalogItem): ReadonlyArray<PopupSection> {
  if (item.popup?.sections?.length) return item.popup.sections!;
  const bodies: ReadonlyArray<PopupBody> =
    (item.popup?.body ?? []) as ReadonlyArray<PopupBody>;
  const splitter = /\n+|•|·|;|—|–|-{1}\s/g;
  return bodies.map((b) => {
    const raw = b.text?.trim() ?? "";
    const parts = raw.split(splitter).map((s) => s.trim()).filter(Boolean);
    return { title: b.heading, items: parts.length ? parts : [raw] };
  });
}

// Markdown (ยังคงเผื่อไว้สำหรับการคัดลอก)
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [xmOpen, setXmOpen] = useState(false); // ป็อปอัพ XM
  const sections = useMemo(() => (item ? buildSections(item) : []), [item]);

  // path ปัจจุบันของหมวด (เช่น /indicators, /ebooks, ...)
  const pathname = usePathname();
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${pathname || ""}`
      : "";

  // ใช้ Toast
  const { toast } = useToast();

  // ล็อก body ไม่ให้เลื่อนตอนเปิดโมดัล
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (item) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [item]);

  const tryNativeShare = async () => {
    if (!item) return;
    const data = {
      title: item.title,
      text: item.popup?.intro || item.summary || item.title,
      url: shareUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch {
        // ยกเลิก/ผิดพลาด -> ใช้เมนูสำรอง
      }
    }
    return false;
  };

  const openShare = async () => {
    const ok = await tryNativeShare();
    if (!ok) setMenuOpen((v) => !v);
  };

  const shareTo = (platform: "facebook" | "line" | "x") => {
    const title = encodeURIComponent(item?.title || "Longtrade Academy");
    const url = encodeURIComponent(shareUrl);
    let href = "";
    switch (platform) {
      case "facebook":
        href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "line":
        href = `https://line.me/R/msg/text/?${encodeURIComponent(
          `${item?.title || ""} ${shareUrl}`
        )}`;
        break;
      case "x":
        href = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
    }
    window.open(href, "_blank", "noopener,noreferrer");
    setMenuOpen(false);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm overflow-y-auto overscroll-contain touch-pan-y"
          onWheel={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.scrollTop += e.deltaY;
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="min-h-full flex items-start justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="modal-shell w-full max-w-4xl overflow-hidden mt-10 mb-10 relative"
              onClick={(e) => e.stopPropagation()}
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

              {/* Body */}
              <div className="p-6 md:p-8">
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

                  {/* ปุ่มแชร์ */}
                  <div className="relative">
                    <button
                      className="glass px-3 py-2 rounded-lg inline-flex items-center gap-2"
                      onClick={openShare}
                      title="แชร์ไปยังโซเชียล / คัดลอกลิงก์"
                    >
                      <Share2 className="w-4 h-4" />
                      แชร์
                    </button>

                    {/* เมนูแชร์สำรอง */}
                    {menuOpen && (
                      <div
                        className="absolute right-0 mt-2 w-56 glass rounded-xl p-2 border border-white/10 shadow-xl z-[5]"
                        role="menu"
                      >
                        <button
                          className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg"
                          onClick={() => shareTo("facebook")}
                        >
                          แชร์ไป Facebook
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg"
                          onClick={() => shareTo("line")}
                        >
                          แชร์ไป LINE
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg"
                          onClick={() => shareTo("x")}
                        >
                          แชร์ไป X (Twitter)
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg inline-flex items-center gap-2"
                          onClick={copyLink}
                        >
                          {copied ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-brand" />
                              คัดลอกลิงก์แล้ว
                            </>
                          ) : (
                            <>
                              <LinkIcon className="w-4 h-4" />
                              คัดลอกลิงก์
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
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

                {/* Metrics */}
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

                {/* CTA Zone */}
                <div className="pt-6 flex flex-wrap gap-3">
                  {/* ปุ่ม LINE เดิม */}
                  <a
                    href="https://line.me/ti/p/~longtrade"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-line"
                  >
                    LINE สั่งซื้อ/สอบถาม
                  </a>

                  {/* ปุ่ม XM: สีแดง ตัวหนังสือสีขาว */}
                  <button
                    type="button"
                    onClick={() => setXmOpen(true)}
                    className="inline-flex items-center rounded-xl px-4 py-2
                               bg-rose-600 hover:bg-rose-500 text-white font-semibold
                               shadow-[0_8px_28px_rgba(244,63,94,.35)] transition
                               border border-white/10"
                    title="รับฟรีสำหรับสมาชิก XM"
                  >
                    รับฟรีสำหรับสมาชิก XM
                  </button>
                </div>
              </div>

              {/* XM POPUP (ธีมแดง) */}
              <AnimatePresence>
                {xmOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setXmOpen(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: 8 }}
                      transition={{ type: "spring", stiffness: 220, damping: 22 }}
                      className="w-full max-w-lg rounded-2xl overflow-hidden relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* พื้นหลัง/กราเดียนต์โทนแดง */}
                      <div className="relative p-6 md:p-8 bg-white/[0.04] border border-white/10">
                        <div className="pointer-events-none absolute -inset-6 md:-inset-8 -z-10 rounded-3xl
                                        bg-[radial-gradient(60%_50%_at_10%_10%,rgba(255,0,0,.18),transparent_70%),radial-gradient(60%_50%_at_90%_90%,rgba(255,70,70,.22),transparent_70%)]" />
                        <h4 className="text-2xl font-extrabold">รับสิทธิ์ฟรีสำหรับสมาชิก XM</h4>
                        <p className="opacity-80 mt-2">
                          สำหรับลูกค้า XM รับสิทธิ์ใช้งานเครื่องมือได้ฟรีตามเงื่อนไขที่กำหนด
                          กรอกอีเมลของคุณเพื่อรับลิงก์เปิดใช้สิทธิ์
                        </p>

                        {/* ฟอร์ม (แสดง Toast เมื่อส่งสำเร็จ) */}
                        <form
                          className="mt-5 flex flex-col gap-3"
                          onSubmit={(e) => {
                            e.preventDefault();
                            setXmOpen(false);
                            toast({
                              title: "ส่งคำขอแล้ว",
                              description: "ทีมงานจะติดต่อกลับทางอีเมลครับ",
                              variant: "success",
                            });
                          }}
                        >
                          <input
                            type="email"
                            required
                            placeholder="กรอกอีเมลของคุณ"
                            className="w-full rounded-xl bg-black/60 border border-white/15 px-4 py-3
                                       outline-none focus:ring-2 focus:ring-rose-500"
                          />
                          <div className="flex gap-3">
                            <button
                              type="submit"
                              className="inline-flex items-center rounded-xl px-4 py-2
                                         bg-rose-600 hover:bg-rose-500 text-white font-semibold
                                         shadow-[0_8px_28px_rgba(244,63,94,.35)] transition"
                            >
                              รับโค้ดสิทธิ์ใช้งาน
                            </button>
                            <button
                              type="button"
                              onClick={() => setXmOpen(false)}
                              className="inline-flex items-center rounded-xl px-4 py-2
                                         bg-white/10 hover:bg-white/15"
                            >
                              ปิด
                            </button>
                          </div>
                          <p className="text-xs opacity-70">
                            * เงื่อนไขเป็นไปตามที่บริษัทกำหนด
                          </p>
                        </form>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
