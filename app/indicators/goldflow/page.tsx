// app/indicators/goldflow/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/Toast";
import { XMClaimModal } from "@/components/Modals";


/* ----------------------------- Fallback (local) ---------------------------- */
const REVIEWS: { text: string; name: string }[] = [
  { text: "ใช้งานง่ายมาก จังหวะเข้าออกชัดเจนกว่าวิธีเดิม ๆ ที่เคยทำ", name: "Somchai T." },
  { text: "ชอบที่มี TP/SL บนจอเลย ไม่ต้องมโนเอง ช่วยวางแผนได้เร็วขึ้นเยอะ", name: "Warunee K." },
  { text: "ตั้งเป้าหมายกำไรแต่ละวันชัดขึ้น เพราะเห็นจุดออกไม่ลังเลแล้ว", name: "Kittipong R." },
  { text: "อินดิเคเตอร์อ่านง่าย เหมาะกับมือใหม่จริง ๆ ค่ะ เข้าใจโครงสร้างตลาดดีขึ้นมาก", name: "Napas L." },
  { text: "ผมเอาไปเทรดทอง M15 ดีมาก แผนชัด ดูจบในหน้าจอเดียว", name: "Prasert M." },
  { text: "Backtest แล้วเวิร์กกับหลายคู่เงิน ดีสุดคือทองกับ GU", name: "Sarayut W." },
  { text: "เส้น MA+สัญญาณเข้าช่วยให้กล้ากดมากขึ้น เพราะมีจุด SL ที่ชัดเจน", name: "Anucha P." },
  { text: "จากที่วูบวาบ กลายเป็นมี Discipline มากขึ้น เพราะแผนบังคับตัวเองได้ดี", name: "Karn N." },
  { text: "สอนการใช้งานให้แบบเข้าใจง่าย ทีมงานตอบไว ประทับใจ", name: "Sudarat A." },
  { text: "ผมชอบที่มี TP1/TP2/TP3 ทำให้แบ่งปิดกำไรเป็นขั้นบันไดได้", name: "Praphan C." },
  { text: "รีวิวจากเพื่อนเลยลองซื้อ ใช้งานจริงแล้วชอบมาก คุ้มราคาจริง ๆ", name: "Siriporn J." },
  { text: "รู้สึกเหมือนโฟกัสดีขึ้น เพราะดูแค่จอเดียว จบ", name: "Apisit D." },
  { text: "จังหวะเข้าออกตามสัญญาณ ซ้อมจนชิน ตอนนี้เสถียรขึ้นเยอะ", name: "Arisa K." },
  { text: "เหมาะกับสายเทรนด์จริง ๆ ถือยาวตามแผนสบายใจ", name: "Chanon P." },
];

function splitRows<T>(arr: T[]) {
  const a: T[] = [];
  const b: T[] = [];
  arr.forEach((x, i) => ((i % 2 === 0 ? a : b).push(x)));
  return [a, b];
}

/* ------------------------------ XM Modal (local) ------------------------------ */
function XMModal({
  open,
  onClose,
  source,
}: { open: boolean; onClose: () => void; source: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [account, setAccount] = useState("");
  const [phone, setPhone] = useState("");

  const endpoint =
    (typeof window !== "undefined" ? (process as any).env?.NEXT_PUBLIC_GS_ENDPOINT : undefined) ||
    process.env.NEXT_PUBLIC_GS_ENDPOINT ||
    "/api/lead";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        account,
        phone,
        page: "/indicators/goldflow",
        source,
        createdAt: new Date().toISOString(),
      };

      const res = await fetch(String(endpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("bad_response");

      // fire-and-forget แจ้ง Telegram ด้วย (มี API อยู่แล้ว)
      fetch("/api/notify/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: [
            "📩 <b>XM Lead ใหม่</b>",
            `ชื่อ: ${name || "-"}`,
            `อีเมล: ${email || "-"}`,
            `พอร์ต: ${account || "-"}`,
            `โทร: ${phone || "-"}`,
            `เพจ: /indicators/goldflow`,
            `ที่มา: ${source || "-"}`,
          ].join("\n"),
        }),
      }).catch(() => {});

      toast({
        title: "ส่งคำขอแล้ว",
        description: "ทีมงานจะติดต่อกลับทางอีเมลหรือโทรศัพท์ครับ",
        variant: "success",
      });

      setName(""); setEmail(""); setAccount(""); setPhone("");
      onClose();
    } catch {
      toast({
        title: "ส่งไม่สำเร็จ",
        description: "กรุณาลองใหม่อีกครั้ง หรือทัก LINE @longtrade",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
        <div className="relative p-6 md:p-8 bg-white/[0.04] border border-white/10">
          <div className="pointer-events-none absolute -inset-6 md:-inset-8 -z-10 rounded-3xl bg-[radial-gradient(60%_50%_at_10%_10%,rgba(255,0,0,.18),transparent_70%),radial-gradient(60%_50%_at_90%_90%,rgba(255,70,70,.22),transparent_70%)]" />
          <h3 className="text-xl md:text-2xl font-bold">รับสิทธิ์ฟรีสำหรับสมาชิก XM</h3>
          <p className="mt-2 text-white/80">กรอกข้อมูลเพื่อให้ทีมงานตรวจสอบสิทธิ์และติดต่อกลับ</p>

          <form className="mt-4 space-y-3" onSubmit={onSubmit}>
            <input type="text" required placeholder="กรอกชื่อของคุณ" className="xm-input" value={name} onChange={(e)=>setName(e.target.value)} />
            <input type="email" required placeholder="กรอกอีเมลของคุณ" className="xm-input" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input type="text" inputMode="numeric" placeholder="เลขพอร์ต/บัญชีเทรด (ถ้ามี)" className="xm-input" value={account} onChange={(e)=>setAccount(e.target.value)} />
            <input type="tel" placeholder="เบอร์โทรสำหรับติดต่อกลับ" className="xm-input" value={phone} onChange={(e)=>setPhone(e.target.value)} />
            <div className="flex items-center gap-2">
              <button type="submit" disabled={loading} className="btn-red">{loading ? "กำลังส่ง..." : "รับโค้ดสิทธิ์ใช้งาน"}</button>
              <button type="button" onClick={onClose} className="btn-ghost">ปิด</button>
            </div>
            <div className="text-xs text-white/60">* เงื่อนไขเป็นไปตามที่บริษัทกำหนด</div>
          </form>
        </div>
      </div>

      <style>{`
        .xm-input{width:100%; border-radius:.75rem; padding:.9rem 1rem; background:rgba(0,0,0,.45); border:1px solid rgba(255,255,255,.16); color:#fff; outline:none}
        .btn-red{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.25rem;border-radius:9999px;background:#e11d48;color:#fff;font-weight:600;box-shadow:0 8px 28px rgba(244,63,94,.35);transition:background .2s ease}
        .btn-red:hover{ background:#f43f5e; }
        .btn-ghost{display:inline-flex;align-items:center;gap:.5rem;padding:.65rem 1.1rem;border-radius:9999px;background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.18)}
      `}</style>
    </div>
  );
}

/* ------------------------------ Page (client) ------------------------------ */

type CmsBlock = {
  title?: string;
  intro?: string;
  images?: string[];
  showcase?: string;
};

const FALLBACK_IMAGES = {
  devices: [
    "/indicator/goldflow/goldflowmocup2.jpg",
    "/indicator/goldflow/goldflowmocup3.jpg",
    "/indicator/goldflow/goldflowmocup1.jpg",
  ],
  functions: [
    "https://ik.imagekit.io/pcqgvgpgi1/FunctionsGF.jpg",
    "https://ik.imagekit.io/pcqgvgpgi1/FunctionsGF%20(2).jpg",
    "https://ik.imagekit.io/pcqgvgpgi1/FunctionsGF%20(1).jpg",
    "https://ik.imagekit.io/pcqgvgpgi1/FunctionsGF%20(3).jpg",
  ],
  performance: [
    "https://ik.imagekit.io/pcqgvgpgi1/Performance%20(1).jpg?updatedAt=1758386579231",
    "https://ik.imagekit.io/pcqgvgpgi1/Performance%20(2).jpg?updatedAt=1758386579247",
    "https://ik.imagekit.io/pcqgvgpgi1/Performance%20(3).jpg?updatedAt=1758386579225",
    "https://ik.imagekit.io/pcqgvgpgi1/Performance%20(4).jpg?updatedAt=1758386579193",
  ],
  showcase: "https://ik.imagekit.io/pcqgvgpgi1/review_gf.jpg?updatedAt=1758450401320",
};

export default function GoldflowPage() {
  const [rowA, rowB] = useMemo(() => splitRows(REVIEWS), []);
  const [openHero, setOpenHero] = useState(false);
  const [openFunc, setOpenFunc] = useState(false);
  const [openPerf, setOpenPerf] = useState(false);
  const [openShowcase, setOpenShowcase] = useState(false);

  // state จาก CMS + fallback
  const [devices, setDevices] = useState<string[]>(FALLBACK_IMAGES.devices);
  const [functionsImgs, setFunctionsImgs] = useState<string[]>(FALLBACK_IMAGES.functions);
  const [performanceImgs, setPerformanceImgs] = useState<string[]>(FALLBACK_IMAGES.performance);
  const [showcaseImg, setShowcaseImg] = useState<string>(FALLBACK_IMAGES.showcase);

  // ดึงจาก Sanity แบบ public (ไม่ใช้ token)
  useEffect(() => {
    const pid = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const ds = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
    if (!pid) return; // ถ้ายังไม่ตั้งค่า ให้ใช้ fallback ไปก่อน

    const qs = encodeURIComponent(`
      {
        "devices": *[_type=="goldflow" && slug.current=="goldflow"][0].devices[]{
          "url": asset->url
        },
        "functions": *[_type=="goldflow" && slug.current=="goldflow"][0].functions[]{
          "url": asset->url
        },
        "performance": *[_type=="goldflow" && slug.current=="goldflow"][0].performance[]{
          "url": asset->url
        },
        "showcase": *[_type=="goldflow" && slug.current=="goldflow"][0].showcase.asset->url
      }
    `);
    const url = `https://${pid}.api.sanity.io/v2023-10-01/data/query/${ds}?query=${qs}`;

    fetch(url)
      .then(r => r.json())
      .then((j) => {
        const r = j?.result || {};
        if (Array.isArray(r.devices)) setDevices(r.devices.map((x: any) => x.url).filter(Boolean));
        if (Array.isArray(r.functions)) setFunctionsImgs(r.functions.map((x: any) => x.url).filter(Boolean));
        if (Array.isArray(r.performance)) setPerformanceImgs(r.performance.map((x: any) => x.url).filter(Boolean));
        if (typeof r.showcase === "string") setShowcaseImg(r.showcase);
      })
      .catch(() => {
        // เงียบไว้ ใช้ fallback เดิม
      });
  }, []);

  return (
    <>
      <Navbar />

      <main className="container-narrow pt-28 md:pt-32 pb-16 space-y-16">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-white/[0.04] border border-white/10 backdrop-blur-sm">
          <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(55%_45%_at_10%_10%,rgba(255,0,0,.16),transparent_65%),radial-gradient(55%_45%_at_90%_90%,rgba(255,70,70,.22),transparent_65%)]" />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">GOLDFLOW SYSTEM</h1>
              <p className="mt-4 text-white/85">
                ระบบวิเคราะห์กราฟ ( Indicators ) ทองคำที่ออกแบบมาเพื่อยกระดับการเทรดของคุณ ให้แม่นยำ มั่นใจ และง่ายขึ้น
              </p>
              <ul className="mt-4 space-y-2 text-white/80 list-disc ml-5">
                <li>แจ้งเตือนสัญญาณ BUY / SELL แบบเรียลไทม์</li>
                <li>กำหนด TP / SL อัตโนมัติ</li>
                <li>ชี้แนวโน้มราคาหลักช่วยให้คุณจับทิศทางได้อย่างมั่นใจ</li>
                <li>ใช้งานง่ายมือใหม่ก็ใช้ได้ มือโปรก็เพิ่มความเร็วในการตัดสินใจ</li>
              </ul>

              <div className="mt-6 flex items-center gap-3 flex-wrap">
                <a href="https://lin.ee/KR48M7V" target="_blank" className="btn-line">LINE สั่งซื้อ/สอบถาม</a>
                <button onClick={() => setOpenHero(true)} className="btn-red">รับฟรีสำหรับสมาชิก XM</button>
              </div>
            </div>

            <VideoPlayer className="relative" src="https://ik.imagekit.io/pcqgvgpgi1/goldflow.mp4" />
          </div>
        </section>

        {/* จุดเด่น */}
        <section className="grid md:grid-cols-3 gap-6">
          {[
            ["แม่นยำทันที", "สัญญาณชัด จับจังหวะไม่พลาด"],
            ["ครบจบในตัว", "มี TP/SL/Entry พร้อมแผนเทรด"],
            ["ยืดหยุ่นสูง", "ใช้ได้ทุกสไตล์ Day / Swing / Position"],
          ].map(([t, d]) => (
            <div key={t} className="glass p-6 rounded-2xl border border-white/10">
              <div className="text-xl font-semibold">{t}</div>
              <div className="opacity-80 mt-1">{d}</div>
            </div>
          ))}
        </section>

        {/* ตัวอย่างหน้าจอ */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Trade Anywhere, Anytime ( ใช้งานได้ทุกอุปกรณ์ )</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {devices.slice(0, 3).map((src, i) => (
              <div key={i} className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10">
                <Image src={`${src}${src.includes("?") ? "&" : "?"}v=${i}`} alt={`goldflow screenshot ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* Functions */}
        <section className="relative overflow-hidden rounded-3xl p-6 md:p-10 bg-white/[0.04] border border-white/10 backdrop-blur-sm">
          <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(55%_45%_at_10%_10%,rgba(255,0,0,.14),transparent_65%),radial-gradient(55%_45%_at_90%_90%,rgba(255,70,70,.18),transparent_65%)]" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold">Functions GoldFlow System</h2>
            <p className="mt-2 text-white/85">
              GoldFlow System คือเครื่องมือที่รวมทุกฟังก์ชันสำคัญไว้ครบในตัวเดียว ตั้งแต่การบอกทิศทางแนวโน้มหลัก ไปจนถึงการแจ้งเตือนสัญญาณ Buy/Sell และจุด TP/SL ที่ชัดเจน
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {functionsImgs.map((src, i) => (
                <div key={i} className="relative w-full aspect-[16/9]">
                  <Image src={src} alt={`goldflow toolkit ${i + 1}`} fill sizes="(min-width:1024px) 45vw, 95vw" className="rounded-xl border border-white/10 object-cover" />
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a href="https://lin.ee/KR48M7V" target="_blank" className="btn-line">สั่งซื้อ/สอบถาม</a>
              <button onClick={() => setOpenFunc(true)} className="btn-red">รับฟรีสำหรับสมาชิก XM</button>
            </div>
          </div>
        </section>

        {/* Performance */}
        <section className="relative overflow-hidden rounded-3xl p-6 md:p-10 bg-white/[0.04] border border-white/10 backdrop-blur-sm">
          <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(55%_45%_at_10%_10%,rgba(255,0,0,.12),transparent_65%),radial-gradient(55%_45%_at_90%_90%,rgba(255,70,70,.18),transparent_65%)]" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold">Performance Overview ( พิสูจน์ด้วยผลงานจริง )</h2>
            <p className="mt-2 text-white/85">
              ตัวอย่างผลลัพธ์จริงจากผู้ใช้งาน GoldFlow System ทั้งแจ้งเตือนสัญญาณ การตั้ง TP/SL และการยืนยันแนวโน้ม
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {performanceImgs.map((src, i) => (
                <div key={i} className="relative w-full aspect-[16/9]">
                  <Image src={src} alt={`goldflow backtest ${i + 1}`} fill sizes="(min-width:1024px) 45vw, 95vw" className="rounded-xl border border-white/10 object-cover" />
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a href="https://lin.ee/KR48M7V" target="_blank" className="btn-line">สั่งซื้อ/สอบถาม</a>
              <button onClick={() => setOpenPerf(true)} className="btn-red">รับฟรีสำหรับสมาชิก XM</button>
            </div>
          </div>
        </section>

        {/* Showcase (1 ภาพ) */}
        <section className="relative overflow-hidden rounded-3xl p-6 md:p-10 bg-white/[0.04] border border-white/10 backdrop-blur-sm">
          <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(55%_45%_at_10%_10%,rgba(255,0,0,.16),transparent_65%),radial-gradient(55%_45%_at_90%_90%,rgba(255,70,70,.22),transparent_65%)]" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold">Real Users (มากกว่า 1,000 เทรดเดอร์เลือกใช้ GoldFlow)</h2>
            <p className="mt-2 text-white/85">ผลลัพธ์จริงจากผู้ใช้งานจริง การันตีประสิทธิภาพ</p>

            <div className="mt-6">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10">
                <Image src={showcaseImg} alt="GoldFlow Showcase" fill className="object-cover" />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a href="https://lin.ee/KR48M7V" target="_blank" className="btn-line">สั่งซื้อ/สอบถาม</a>
              <button onClick={() => setOpenShowcase(true)} className="btn-red">รับฟรีสำหรับสมาชิก XM</button>
            </div>
          </div>
        </section>

        {/* รีวิวเลื่อน 2 แถว */}
        <section id="reviews">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">รีวิวผู้ใช้งานจริง</h2>
          <div className="space-y-4">
            <MarqueeRow items={rowA} direction="left" duration={45} />
            <MarqueeRow items={rowB} direction="right" duration={55} />
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold">พร้อมเริ่มใช้ GOLDFLOW แล้วหรือยัง?</h3>
          <div className="mt-5 flex items-center gap-3 justify-center">
            <a href="https://lin.ee/KR48M7V" target="_blank" className="btn-line">LINE สั่งซื้อ/สอบถาม</a>
            <Link href="/indicators" className="glass px-4 py-2 rounded-full border border-white/10">ดูอินดิเคเตอร์ทั้งหมด</Link>
          </div>
        </section>
      </main>

      {/* XM Modals */}
      <XMModal open={openHero} onClose={() => setOpenHero(false)} source="goldflow_hero" />
      <XMModal open={openFunc} onClose={() => setOpenFunc(false)} source="goldflow_functions" />
      <XMModal open={openPerf} onClose={() => setOpenPerf(false)} source="goldflow_performance" />
      <XMModal open={openShowcase} onClose={() => setOpenShowcase(false)} source="goldflow_showcase" />

      {/* styles เฉพาะหน้านี้ */}
      <style>{`
        .btn-red{
          display:inline-flex;align-items:center;gap:.5rem;
          padding:.75rem 1.25rem;border-radius:9999px;
          background:#e11d48;color:#fff;font-weight:600;
          box-shadow:0 8px 28px rgba(244,63,94,.35);
          transition:background .2s ease;
        }
        .btn-red:hover{ background:#f43f5e; }
        .btn-ghost{
          display:inline-flex;align-items:center;gap:.5rem;
          padding:.65rem 1.1rem;border-radius:9999px;
          background:rgba(255,255,255,.08);
          color:#fff;border:1px solid rgba(255,255,255,.18);
        }
        .btn-ghost:hover{ background:rgba(255,255,255,.12); }

        .gf-row { overflow: hidden; position: relative;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%);
                  mask-image: linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%); }
        .gf-track { display:inline-flex; gap:16px; will-change:transform; animation-timing-function:linear; animation-iteration-count:infinite; white-space:nowrap; }
        .gf-left  { animation-name: gf-marquee-left;  }
        .gf-right { animation-name: gf-marquee-right; }
        @keyframes gf-marquee-left { from { transform: translateX(0); } to { transform: translateX(-50%);} }
        @keyframes gf-marquee-right{ from { transform: translateX(-50%);} to { transform: translateX(0);} }
        .gf-card { min-width:300px; max-width:540px; }
        @media (min-width:768px){ .gf-card{ min-width:420px; } }
      `}</style>
    </>
  );
}

function MarqueeRow({
  items,
  direction = "left",
  duration = 50,
}: {
  items: { text: string; name: string }[];
  direction?: "left" | "right";
  duration?: number;
}) {
  const loop = [...items, ...items];
  return (
    <div className="gf-row">
      <div className={`gf-track ${direction === "left" ? "gf-left" : "gf-right"}`} style={{ animationDuration: `${duration}s` }}>
        {loop.map((r, i) => (
          <div key={`${r.name}-${i}`} className="gf-card glass p-6 rounded-2xl border border-white/10">
            <div className="opacity-90">{r.text}</div>
            <div className="mt-3 text-white/70 text-sm">— {r.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
