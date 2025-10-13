"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Share2, CheckCircle2, Link as LinkIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import type { CatalogItem, PopupSection, PopupBody } from "@/data/types";
import { useToast } from "@/components/Toast";

const DETAIL_MODAL_Z = 1000; // z-index ของรายละเอียด
const XM_MODAL_Z = 1200;     // z-index ของ XM (ต้องสูงกว่า)

/* ------------ utils ------------- */
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

/* ===================== DetailModal ===================== */
export function DetailModal({
  item,
  onClose,
}: {
  item: CatalogItem;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sections = useMemo(() => (item ? buildSections(item) : []), [item]);

  const pathname = usePathname();
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${pathname || ""}`
      : "";

  const { toast } = useToast();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const tryNativeShare = async () => {
    const data = {
      title: item.title,
      text: item.popup?.intro || item.summary || item.title,
      url: shareUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch {}
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

  return createPortal(
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto overscroll-contain touch-pan-y"
      style={{ zIndex: DETAIL_MODAL_Z }}
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
        <div
          className="w-full max-w-4xl overflow-hidden mt-10 mb-10 relative rounded-2xl border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,.06)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
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
                      <span key={t} className="px-2 py-1 rounded-md bg-white/10 text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* แชร์ */}
              <div className="relative">
                <button
                  className="glass px-3 py-2 rounded-lg inline-flex items-center gap-2 border border-white/10"
                  onClick={openShare}
                  title="แชร์ไปยังโซเชียล / คัดลอกลิงก์"
                >
                  <Share2 className="w-4 h-4" />
                  แชร์
                </button>

                {menuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl p-2 bg-white/[0.04] border border-white/10 shadow-xl z-[5]"
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
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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

            {/* Sections */}
            <ol className="mt-6 space-y-4">
              {sections.map((s, i) => (
                <li
                  key={i}
                  className="p-4 border border-white/10 rounded-xl relative bg-white/[0.02]"
                >
                  <div className="absolute -left-[1px] top-0 bottom-0 w-[4px] bg-gradient-to-b from-rose-500/70 to-transparent rounded-l-xl" />
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

            {/* CTA */}
            <div className="pt-6 flex flex-wrap gap-3">
              <a
                href="https://line.me/ti/p/~longtrade"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-xl px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
              >
                LINE สั่งซื้อ/สอบถาม
              </a>

              {/* ส่ง event ไป XMClaimModal (ตัวเดียวที่ layout) */}
              <button
                onClick={() =>
                  document.dispatchEvent(
                    new CustomEvent("xm-open", {
                      detail: {
                        source: `catalog:${item?.title || ""}`,
                        page: typeof window !== "undefined" ? window.location.pathname : "",
                      },
                    })
                  )
                }
                className="inline-flex items-center rounded-xl px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-[0_8px_28px_rgba(244,63,94,.35)] transition"
              >
                รับสิทธิสำหรับสมาชิก XM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ===================== XMClaimModal (global singleton) ===================== */
type XMClaimPayload = {
  name: string;
  email: string;
  account?: string;
  phone?: string;
  page?: string;
  source?: string;
};
const GAS_EP =
  (process.env.NEXT_PUBLIC_GAS_XM_ENDPOINT as string | undefined)?.trim() || "";

export function XMClaimModal() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<string>("");
  const [page, setPage] = useState<string>("");

  const name = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const account = useRef<HTMLInputElement>(null);
  const phone = useRef<HTMLInputElement>(null);

  // ฟังอีเวนต์ global แล้วเปิด modal
  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent).detail || {};
      setSource(d.source || "");
      setPage(d.page || "");
      setOpen(true);
    };
    document.addEventListener("xm-open", onOpen);
    return () => document.removeEventListener("xm-open", onOpen);
  }, []);

  const submit = async () => {
    if (!GAS_EP) {
      toast({ title: "Endpoint ไม่ถูกตั้งค่า", variant: "error" as any });
      return;
    }

    const payload: XMClaimPayload = {
      name: name.current?.value?.trim() || "",
      email: email.current?.value?.trim() || "",
      account: account.current?.value?.trim(),
      phone: phone.current?.value?.trim(),
      page,
      source,
    };

    if (!payload.name || !payload.email) {
      toast({ title: "กรอกชื่อและอีเมลก่อนนะ", variant: "error" as any });
      return;
    }

    try {
      setLoading(true);
      await fetch(GAS_EP, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });

      try {
        fetch("/api/notify/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: [
              "📩 <b>XM Lead ใหม่</b>",
              `ชื่อ: ${payload.name || "-"}`,
              `อีเมล: ${payload.email || "-"}`,
              `พอร์ต: ${payload.account || "-"}`,
              `โทร: ${payload.phone || "-"}`,
              `เพจ: ${payload.page || "-"}`,
              `ที่มา: ${payload.source || "-"}`,
            ].join("\n"),
          }),
        }).catch(() => {});
      } catch {}

      setOpen(false);
      if (name.current) name.current.value = "";
      if (email.current) email.current.value = "";
      if (account.current) account.current.value = "";
      if (phone.current) phone.current.value = "";

      toast({
        title: "ส่งคำขอแล้ว",
        description: "ทีมงานจะติดต่อกลับทางอีเมลหรือโทรศัพท์ครับ",
        variant: "success" as any,
      });
    } catch (err: any) {
      toast({
        title: "ส่งไม่สำเร็จ",
        description: err?.message || "Failed to fetch",
        variant: "error" as any,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 grid place-items-center bg-black/60 backdrop-blur-sm p-4"
      style={{ zIndex: XM_MODAL_Z }}
      onClick={() => setOpen(false)}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-[radial-gradient(60%_50%_at_10%_10%,rgba(255,0,0,.18),transparent_70%),radial-gradient(60%_50%_at_90%_90%,rgba(255,70,70,.22),transparent_70%)]" />
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl md:text-3xl font-extrabold">รับสิทธิ์ฟรีสำหรับสมาชิก XM</h3>
          <button
            className="text-2xl leading-none opacity-80 hover:opacity-100"
            onClick={() => setOpen(false)}
            aria-label="ปิด"
          >
            ×
          </button>
        </div>

        <p className="opacity-80 mt-2">กรอกข้อมูลเพื่อให้ทีมงานตรวจสอบสิทธิ์และติดต่อกลับ</p>

        <div className="mt-5 grid gap-3">
          <input ref={name} className="xm-input" placeholder="ชื่อ-นามสกุล" />
          <input ref={email} className="xm-input" type="email" placeholder="อีเมลของคุณ" />
          <input ref={account} className="xm-input" placeholder="เลขพอร์ต/บัญชีเทรด (ถ้ามี)" />
          <input ref={phone} className="xm-input" placeholder="เบอร์โทรสำหรับติดต่อกลับ" />

          <div className="flex gap-2 mt-1">
            <button onClick={submit} disabled={loading} className="btn-red disabled:opacity-60">
              {loading ? "กำลังส่ง…" : "รับโค้ดสิทธิ์ใช้งาน"}
            </button>
            <button onClick={() => setOpen(false)} className="btn-ghost">
              ปิด
            </button>
          </div>
          <div className="text-xs text-white/60">* เงื่อนไขเป็นไปตามที่บริษัทกำหนด</div>
        </div>
      </div>

      <style jsx>{`
        .xm-input {
          width: 100%;
          border-radius: 0.75rem;
          padding: 0.9rem 1rem;
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #fff;
          outline: none;
        }
        .btn-red {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 9999px;
          background: #e11d48;
          color: #fff;
          font-weight: 600;
          box-shadow: 0 8px 28px rgba(244, 63, 94, 0.35);
          transition: background 0.2s ease;
        }
        .btn-red:hover {
          background: #f43f5e;
        }
        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.1rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
      `}</style>
    </div>,
    document.body
  );
}
