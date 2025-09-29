"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { QUICK_REPLIES, getBotReply } from "@/config/botFaq";
import {
  MessageCircle,
  Link2,
  X,
  Facebook,
  Youtube,
  Globe,
  SendHorizonal,
  Sparkles,
} from "lucide-react";

/** ----------------------------------------------------------------
 *  Local types & helpers (ไม่พึ่งพาไฟล์ config เดิม เพื่อลดผลกระทบ)
 *  ---------------------------------------------------------------*/
type SupportLinkKind = "fb" | "line" | "yt" | "web" | "promo";

type LinkItem =
  | {
      label: string;
      href: string;
      external?: boolean;
      kind: Exclude<SupportLinkKind, "promo">; // ใช้ไอคอนจาก lucide
      img?: undefined;
    }
  | {
      label: string;
      href: string;
      external?: boolean;
      kind: "promo"; // ใช้เป็นภาพ (เช่น LT/XM)
      img: string;   // URL รูป 1:1
    };

/** ลำดับและลิ้งก์ตามที่ผู้ใช้ต้องการ */
const LINKS: ReadonlyArray<LinkItem> = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/LongTradeAcademy",
    external: true,
    kind: "fb",
  },
  {
    label: "LINE",
    href: "https://lin.ee/oqfUFhG",
    external: true,
    kind: "line",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@AcademyLongtrade",
    external: true,
    kind: "yt",
  },
  {
    label: "Website",
    href: "https://longtrade-academy.com/",
    external: true,
    kind: "web",
  },
  // ใช้รูปภาพเป็นไอคอน
  {
    label: "สิทธิพิเศษ",
    href: "/promo#lt",
    kind: "promo",
    img: "https://ik.imagekit.io/pcqgvgpgi1/LTlogo.jpg",
  },
  {
    label: "โปรโมชั่น XM",
    href: "/promo#xm",
    kind: "promo",
    img: "https://ik.imagekit.io/pcqgvgpgi1/XMlogo.jpg",
  },
];

function LineIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" {...props}>
      <path d="M39.6 8.4C36.8 5.6 32.6 4 28 4H20C11.2 4 4 10 4 17.6c0 5.5 3.9 10.2 9.6 12.5-.2.8-1.2 4.4-1.3 5-.2.9.3 1.1 1 1 .8-.1 5.1-3.4 5.9-3.9 2.4.4 4.8.5 7.3.2 8.8-1.2 15.5-7.9 15.5-15.8 0-4.3-1.8-7.9-5.4-10.2z" />
    </svg>
  );
}

function LinkIconSwitch({
  kind,
  className,
}: {
  kind: Exclude<SupportLinkKind, "promo">;
  className?: string;
}) {
  const common = "h-4 w-4";
  switch (kind) {
    case "fb":
      return <Facebook className={clsx(common, className)} />;
    case "yt":
      return <Youtube className={clsx(common, className)} />;
    case "web":
      return <Globe className={clsx(common, className)} />;
    case "line":
      return <LineIcon className={clsx(common, className)} />;
    default:
      return <Link2 className={clsx(common, className)} />;
  }
}

type Msg = { role: "user" | "bot"; text: string };

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"links" | "bot">("links");
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text:
        'เลือกหัวข้อด้านล่างเพื่อเริ่มได้เลยครับ/ค่ะ หรือพิมพ์คำถาม เช่น "ราคา", "สั่งซื้อ", "ติดตั้งยังไง", "รีวิว", "โปรโมชั่น"',
    },
  ]);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function sendText(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setMsg("");
    await new Promise((r) => setTimeout(r, 180));
    const reply = getBotReply(trimmed);
    setMessages((m) => [...m, { role: "bot", text: reply }]);
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          "fixed z-[9999] bottom-5 right-5 h-14 w-14 rounded-full",
          "bg-rose-600 hover:bg-rose-500 text-white shadow-lg",
          "flex items-center justify-center transition"
        )}
        aria-label="Open support"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {open && (
        <div
          ref={panelRef}
          onWheelCapture={(e) => e.stopPropagation()}
          className={clsx(
            "fixed z-[9999] bottom-24 right-5 w-[360px] max-w-[88vw]",
            "rounded-2xl overflow-hidden border border-white/10",
            "bg-neutral-950/90 backdrop-blur-md shadow-2xl",
            "overscroll-contain"
          )}
        >
          <div className="relative p-4 bg-gradient-to-r from-rose-700/30 to-rose-500/10 border-b border-white/10">
            <div className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-400" />
              Longtrade Support
            </div>
            <div className="text-xs opacity-80">เราพร้อมช่วยเหลือคุณทุกวัน</div>
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 p-1 rounded-md hover:bg-white/10"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-2 pt-2">
            <div className="mx-2 bg-white/5 rounded-full p-1 flex">
              <button
                onClick={() => setTab("links")}
                className={clsx(
                  "flex-1 rounded-full py-2 text-sm font-medium",
                  tab === "links"
                    ? "bg-rose-600 text-white"
                    : "text-white/80 hover:text-white"
                )}
              >
                ลิงก์ด่วน
              </button>
              <button
                onClick={() => setTab("bot")}
                className={clsx(
                  "flex-1 rounded-full py-2 text-sm font-medium",
                  tab === "bot"
                    ? "bg-rose-600 text-white"
                    : "text-white/80 hover:text-white"
                )}
              >
                แชตบอท
              </button>
            </div>
          </div>

          <div className="p-3">
            {tab === "links" ? (
              <div className="grid grid-cols-2 gap-3">
                {LINKS.map((l) => (
                  <Link
                    key={l.label + l.href}
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    className="group glass rounded-xl p-3 border border-white/10 hover:border-white/20 inline-flex items-center gap-2"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600/20 text-rose-400 group-hover:bg-rose-600/30 overflow-hidden">
                      {l.kind === "promo" && l.img ? (
                        // ใช้รูปภาพเป็นไอคอนสำหรับ LT/XM
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={l.img}
                          alt=""
                          className="h-5 w-5 rounded-[6px] object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <LinkIconSwitch kind={l.kind as Exclude<SupportLinkKind, "promo">} />
                      )}
                    </span>
                    <span className="font-medium">{l.label}</span>
                  </Link>
                ))}
                <div className="col-span-2 text-xs opacity-70 mt-1">
                  * ลิงก์ทั้งหมดเป็นช่องทางอย่างเป็นทางการของ Longtrade Academy
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col h-[400px] overscroll-contain"
                onWheelCapture={(e) => e.stopPropagation()}
              >
                <div className="flex gap-2 flex-wrap mb-2">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendText(q)}
                      className="text-xs rounded-full px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <div
                  className="flex-1 overflow-y-auto space-y-2 pr-1 overscroll-contain"
                  onWheelCapture={(e) => e.stopPropagation()}
                >
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={clsx(
                        "max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap",
                        m.role === "user"
                          ? "ml-auto bg-rose-600/80 text-white"
                          : "bg-white/5 border border-white/10"
                      )}
                    >
                      {m.text}
                    </div>
                  ))}
                </div>

                <form
                  className="mt-2 flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void sendText(msg);
                  }}
                >
                  <input
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="พิมพ์ข้อความ…"
                    className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-rose-500/60"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-rose-600 hover:bg-rose-500 px-3 py-2 text-sm font-medium inline-flex items-center gap-1"
                  >
                    ส่ง <SendHorizonal className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
