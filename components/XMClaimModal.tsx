// components/XMClaimModal.tsx
"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useToast } from "@/components/Toast";

type XMClaimPayload = {
  name: string;
  email: string;
  account?: string;
  phone?: string;
  page?: string;
  source?: string;
};

const EP =
  (process.env.NEXT_PUBLIC_GAS_XM_ENDPOINT as string | undefined)?.trim() || "";

export function XMClaimButton({
  children = "รับสิทธิสำหรับสมาชิก XM",
  source = "promo",
  className = "btn-red",
}: {
  children?: React.ReactNode;
  source?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <button
      id={id}
      type="button"
      className={className}
      onClick={() =>
        document.dispatchEvent(
          new CustomEvent("xm-open", { detail: { source } })
        )
      }
    >
      {children}
    </button>
  );
}

export default function XMClaimModal() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<string>("");

  const name = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const account = useRef<HTMLInputElement>(null);
  const phone = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      setSource(detail.source || "");
      setOpen(true);
    };
    document.addEventListener("xm-open", onOpen);
    return () => document.removeEventListener("xm-open", onOpen);
  }, []);

  const submit = async () => {
    if (!EP) {
      toast({ title: "Endpoint ไม่ถูกตั้งค่า", variant: "error" });
      return;
    }
    const payload: XMClaimPayload = {
      name: name.current?.value?.trim() || "",
      email: email.current?.value?.trim() || "",
      account: account.current?.value?.trim(),
      phone: phone.current?.value?.trim(),
      page: typeof window !== "undefined" ? window.location.pathname : "",
      source,
    };

    if (!payload.name || !payload.email) {
      toast({ title: "กรอกชื่อและอีเมลก่อนนะ", variant: "error" });
      return;
    }

    try {
      setLoading(true);

      // ส่งเป็น simple request เลี่ยง preflight CORS
      const res = await fetch(EP, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, // เลี่ยง preflight
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));

      setOpen(false);
      toast({
        title: "ส่งคำขอแล้ว",
        description: "ทีมงานจะติดต่อกลับทางอีเมลหรือโทรศัพท์ครับ",
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "ส่งไม่สำเร็จ",
        description: err?.message || "Failed to fetch",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-[radial-gradient(60%_50%_at_10%_10%,rgba(255,0,0,.18),transparent_70%),radial-gradient(60%_50%_at_90%_90%,rgba(255,70,70,.22),transparent_70%)]" />

        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl md:text-3xl font-extrabold">
            รับสิทธิ์ฟรีสำหรับสมาชิก XM
          </h3>
          <button
            className="text-2xl leading-none opacity-80 hover:opacity-100"
            onClick={() => setOpen(false)}
            aria-label="ปิด"
          >
            ×
          </button>
        </div>

        <p className="opacity-80 mt-2">
          กรอกข้อมูลเพื่อให้ทีมงานตรวจสอบสิทธิ์และติดต่อกลับ
        </p>

        <div className="mt-5 grid gap-3">
          <input ref={name} className="xm-input" placeholder="ชื่อ-นามสกุล" />
          <input
            ref={email}
            className="xm-input"
            type="email"
            placeholder="อีเมลของคุณ"
          />
          <input
            ref={account}
            className="xm-input"
            placeholder="เลขพอร์ต/บัญชีเทรด (ถ้ามี)"
          />
          <input
            ref={phone}
            className="xm-input"
            placeholder="เบอร์โทรสำหรับติดต่อกลับ"
          />

          <div className="flex gap-2 mt-1">
            <button
              onClick={submit}
              disabled={loading}
              className="btn-red disabled:opacity-60"
            >
              {loading ? "กำลังส่ง…" : "รับโค้ดสิทธิ์ใช้งาน"}
            </button>
            <button onClick={() => setOpen(false)} className="btn-ghost">
              ปิด
            </button>
          </div>
          <div className="text-xs text-white/60">
            * เงื่อนไขเป็นไปตามที่บริษัทกำหนด
          </div>
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
