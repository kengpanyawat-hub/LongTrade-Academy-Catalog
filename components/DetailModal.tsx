// components/XMClaimModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/Toast";

type XMOpenDetail = {
  source?: string;
  page?: string;
};

export default function XMClaimModal() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [account, setAccount] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState<string>("");
  const [page, setPage] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // endpoint (fallback ไป /api/lead)
  const ENDPOINT =
    (typeof window !== "undefined"
      ? (process as any).env?.NEXT_PUBLIC_GS_ENDPOINT
      : undefined) ||
    process.env.NEXT_PUBLIC_GS_ENDPOINT ||
    "/api/lead";

  // ฟัง event จากที่อื่น: document.dispatchEvent(new CustomEvent('xm-open', { detail }))
  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent<XMOpenDetail>).detail || {};
      setSource(d.source ?? "");
      setPage(d.page ?? "");
      setOpen(true);
    };
    document.addEventListener("xm-open", handler as EventListener);
    return () =>
      document.removeEventListener("xm-open", handler as EventListener);
  }, []);

  // ปิดเมื่อกด ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // ล็อกสกอลล์เมื่อเปิด
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const reset = () => {
    setName("");
    setEmail("");
    setAccount("");
    setPhone("");
    setSource("");
    setPage("");
  };

  const submit = async () => {
    if (!ENDPOINT) {
      toast({ title: "Endpoint ไม่ถูกตั้งค่า", variant: "error" });
      return;
    }
    if (!name || !email) {
      toast({ title: "กรอกชื่อและอีเมลให้ครบก่อนนะ", variant: "error" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        email,
        account,
        phone,
        source,
        page: page || (typeof window !== "undefined" ? window.location.pathname : ""),
        createdAt: new Date().toISOString(),
      };

      const res = await fetch(String(ENDPOINT), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("bad_response");

      toast({
        title: "ส่งคำขอแล้ว",
        description: "ทีมงานจะติดต่อกลับทางอีเมลหรือโทรศัพท์",
        variant: "success",
      });
      reset();
      setOpen(false);
    } catch (err) {
      toast({
        title: "ส่งไม่สำเร็จ",
        description: "กรุณาลองใหม่ หรือทัก LINE @longtrade",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm grid place-items-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg rounded-2xl overflow-hidden relative"
      >
        <div className="relative p-6 md:p-8 bg-white/[0.04] border border-white/10">
          <div className="pointer-events-none absolute -inset-6 md:-inset-8 -z-10 rounded-3xl bg-[radial-gradient(60%_50%_at_10%_10%,rgba(255,0,0,.18),transparent_70%),radial-gradient(60%_50%_at_90%_90%,rgba(255,70,70,.22),transparent_70%)]" />
          <h3 className="text-xl md:text-2xl font-bold">
            รับสิทธิ์ฟรีสำหรับสมาชิก XM
          </h3>
          <p className="mt-2 text-white/80">
            กรอกข้อมูลเพื่อให้ทีมงานตรวจสอบสิทธิ์และติดต่อกลับ
          </p>

          <div className="mt-4 space-y-3">
            <input
              type="text"
              required
              placeholder="กรอกชื่อของคุณ"
              className="xm-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              required
              placeholder="กรอกอีเมลของคุณ"
              className="xm-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="เลขพอร์ต/บัญชีเทรด (ถ้ามี)"
              className="xm-input"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            />
            <input
              type="tel"
              placeholder="เบอร์โทรสำหรับติดต่อกลับ"
              className="xm-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {/* ซ่อนข้อมูลอัตโนมัติ */}
            {source ? (
              <input
                type="hidden"
                value={source}
                readOnly
                aria-hidden="true"
              />
            ) : null}
            {page ? (
              <input type="hidden" value={page} readOnly aria-hidden="true" />
            ) : null}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                disabled={loading}
                className="btn-red"
                onClick={submit}
              >
                {loading ? "กำลังส่ง..." : "รับโค้ดสิทธิ์ใช้งาน"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-ghost"
              >
                ปิด
              </button>
            </div>
            <div className="text-xs text-white/60">
              * เงื่อนไขเป็นไปตามที่บริษัทกำหนด
            </div>
          </div>
        </div>
      </div>

      {/* styles เฉพาะโมดัล */}
      <style jsx global>{`
        .xm-input {
          width: 100%;
          border-radius: 0.75rem;
          padding: 0.9rem 1rem;
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #fff;
          outline: none;
        }
        .xm-input::placeholder {
          color: rgba(255, 255, 255, 0.55);
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
        .btn-ghost:hover {
          background: rgba(255, 255, 255, 0.12);
        }
      `}</style>
    </div>
  );
}
