// app/indicators/boost-capital/page.tsx
"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/Toast";
import { XMClaimModal } from "@/components/Modals";


// — รีวิวตัวอย่าง (ปรับ/เพิ่ม-ลด ได้)
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
  const a: T[] = []; const b: T[] = [];
  arr.forEach((x, i) => ((i % 2 === 0 ? a : b).push(x)));
  return [a, b];
}

/** ---- XM Modal (ยกตรงจาก goldflow) ---- */
function XMModal({
  open,
  onClose,
  source,
}: {
  open: boolean;
  onClose: () => void;
  source: string;
}) {
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
        page: "/indicators/boost-capital", // << เปลี่ยนหน้าอ้างอิง
        source,
        createdAt: new Date().toISOString(),
      };
      const res = await fetch(String(endpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("bad_response");
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
    </div>
  );
}

export default function BoostCapitalPage() {
  const [rowA, rowB] = useMemo(() => splitRows(REVIEWS), []);
  const [openHero, setOpenHero] = useState(false);
  const [openFunc, setOpenFunc] = useState(false);
  const [openPerf, setOpenPerf] = useState(false);

  return (
    <>
      <Navbar />

      <main className="container-narrow pt-28 md:pt-32 pb-16 space-y-16">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-white/[0.04] border border-white/10 backdrop-blur-sm">
          <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(55%_45%_at_10%_10%,rgba(255,0,0,.16),transparent_65%),radial-gradient(55%_45%_at_90%_90%,rgba(255,70,70,.22),transparent_65%)]" />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                BOOST CAPITAL I
              </h1>
              <p className="mt-4 text-white/85">
                ยกระดับการเทรดของคุณด้วย Indicator Longtrade Boost Capital I อินดิเคเตอร์ที่รวมเทคนิคการเทรดทุกรูปแบบ ทั้ง Trend-Follow, Breakout, Swing Trade และ Scalping พร้อมระบบแจ้งสัญญาณเข้าออก Buy/Sell อัตโนมัติ แสดง TP/SL และโซนสำคัญแบบเรียลไทม์
              </p>
              <ul className="mt-4 space-y-2 text-white/80 list-disc ml-5">
                <li>สัญญาณซื้อขายแม่นยำ ครอบคลุมทุกสไตล์ (Trend, Swing, Scalping)</li>
                <li>มี Calculator ช่วยคำนวณ Entry/TP/SL อัตโนมัติ</li>
                <li>แสดง Volume / Money Flow และ Zone / Order Block สำคัญ</li>
              </ul>

              <div className="mt-6 flex items-center gap-3 flex-wrap">
                <a href="https://lin.ee/KR48M7V" target="_blank" className="btn-line">LINE สั่งซื้อ/สอบถาม</a>
                <button onClick={() => setOpenHero(true)} className="btn-red">รับฟรีสำหรับสมาชิก XM</button>
              </div>
            </div>

            {/* ตัวอย่างวิดีโอ/เดโม่ — เปลี่ยน URL ได้ */}
            <VideoPlayer className="relative" src="/indicator/boost-capital/VideoBC.mp4" />
          </div>
        </section>

        {/* จุดเด่นย่อ */}
        <section className="grid md:grid-cols-3 gap-6">
          {[
            ["แม่นยำฉับไว", "สัญญาณชัด ลดลังเล"],
            ["ครบจบในจอ", "มี Entry/TP/SL ครบ"],
            ["บริหารทุน", "เหมาะกับแนวทางขยายทุนเป็นขั้นบันได"],
          ].map(([t, d]) => (
            <div key={t} className="glass p-6 rounded-2xl border border-white/10">
              <div className="text-xl font-semibold">{t}</div>
              <div className="opacity-80 mt-1">{d}</div>
            </div>
          ))}
        </section>

        {/* แกลเลอรี 3 ภาพตัวอย่าง */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">ตัวอย่างหน้าจอ</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "/indicator/boost-capital/indicatorbc_moc1.jpg",
              "/indicator/boost-capital/indicatorbc_moc2.jpg",
              "/indicator/boost-capital/indicatorbc_moc3.jpg",
            ].map((src, i) => (
              <div key={i} className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10">
                <Image src={`${src}?v=${i}`} alt={`boost-capital screenshot ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* ฟังก์ชันหลัก */}
        <section className="relative overflow-hidden rounded-3xl p-6 md:p-10 bg-white/[0.04] border border-white/10 backdrop-blur-sm">
          <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(55%_45%_at_10%_10%,rgba(255,0,0,.14),transparent_65%),radial-gradient(55%_45%_at_90%_90%,rgba(255,70,70,.18),transparent_65%)]" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold">Functions BOOST CAPITAL I</h2>
            <p className="mt-2 text-white/85">
              คือเครื่องมือที่รวมทุกฟังก์ชันเทรดเดอร์ต้องใช้ไว้ในตัวเดียว ออกแบบสำหรับแนว Trend-Follow และ Breakout ตั้งแต่บอกทิศทาง แจ้งโซน Entry พร้อมสัญญาณเตือนอัตโนมัติ คำนวณ TP/SL และวางแผนแบ่งไม้ มองเห็นจังหวะสวิง จุดกลับตัว ภาวะตลาดแบบเรียลไทม์ รวมถึง Demand & Supply Zone และ Money Flow Profile ช่วยให้คุณตัดสินใจเทรดได้แม่นยำและมีระบบมากขึ้น
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "/indicator/boost-capital/FunctionsBC1.jpg",
                "/indicator/boost-capital/FunctionsBC2.jpg",
                "/indicator/boost-capital/FunctionsBC3.jpg",
                "/indicator/boost-capital/FunctionsBC4.jpg",
              ].map((src, i) => (
                <div key={i} className="relative w-full aspect-[16/9]">
                  <Image src={src} alt={`boost-capital toolkit ${i + 1}`} fill sizes="(min-width:1024px) 45vw, 95vw" className="rounded-xl border border-white/10 object-cover" />
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a href="https://lin.ee/KR48M7V" target="_blank" className="btn-line">สั่งซื้อ/สอบถาม</a>
              <button onClick={() => setOpenFunc(true)} className="btn-red">รับฟรีสำหรับสมาชิก XM</button>
            </div>
          </div>
        </section>

        {/* ผลงาน/Performance (วางภาพ/ผลลัพธ์จริง) */}
        <section className="relative overflow-hidden rounded-3xl p-6 md:p-10 bg-white/[0.04] border border-white/10 backdrop-blur-sm">
          <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(55%_45%_at_10%_10%,rgba(255,0,0,.12),transparent_65%),radial-gradient(55%_45%_at_90%_90%,rgba(255,70,70,.18),transparent_65%)]" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold">Performance Overview</h2>
            <p className="mt-2 text-white/85">
              ผลลัพธ์จากการใช้งานจริงที่สมาชิกสามารถทำได้ สะท้อนแนวคิดการบริหารความเสี่ยงและวางแผนเทรดอย่างเป็นระบบ ช่วยยืนยันว่าการใช้เครื่องมือและวิธีการที่ถูกต้องสามารถเพิ่มประสิทธิภาพการตัดสินใจและสร้างผลตอบแทนได้จริง ทั้งในรูปแบบรายวันและระยะยาว
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "/indicator/boost-capital/review_bc1.jpg",
                "/indicator/boost-capital/review_bc2.jpg",
                "/indicator/boost-capital/review_bc3.jpg",
                "/indicator/boost-capital/review_bc4.jpg",
              ].map((src, i) => (
                <div key={i} className="relative w-full aspect-[16/9]">
                  <Image src={src} alt={`boost-capital performance ${i + 1}`} fill sizes="(min-width:1024px) 45vw, 95vw" className="rounded-xl border border-white/10 object-cover" />
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a href="https://lin.ee/KR48M7V" target="_blank" className="btn-line">สั่งซื้อ/สอบถาม</a>
              <button onClick={() => setOpenPerf(true)} className="btn-red">รับฟรีสำหรับสมาชิก XM</button>
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
          <h3 className="text-2xl md:text-3xl font-bold">พร้อมเริ่มใช้ BOOST CAPITAL I แล้วหรือยัง?</h3>
          <div className="mt-5 flex items-center gap-3 justify-center">
            <a href="https://lin.ee/KR48M7V" target="_blank" className="btn-line">LINE สั่งซื้อ/สอบถาม</a>
            <Link href="/indicators" className="glass px-4 py-2 rounded-full border border-white/10">ดูอินดิเคเตอร์ทั้งหมด</Link>
          </div>
        </section>
      </main>

      {/* XM Modals */}
      <XMModal open={openHero} onClose={() => setOpenHero(false)} source="boost_hero" />
      <XMModal open={openFunc} onClose={() => setOpenFunc(false)} source="boost_functions" />
      <XMModal open={openPerf} onClose={() => setOpenPerf(false)} source="boost_performance" />

      {/* styles เฉพาะหน้านี้ (คงจาก goldflow) */}
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
        .xm-input{
          width:100%; border-radius:.75rem; padding:.9rem 1rem;
          background:rgba(0,0,0,.45); border:1px solid rgba(255,255,255,.16);
          color:#fff; outline:none;
        }
        .xm-input::placeholder{ color:rgba(255,255,255,.55); }
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
      <style>{`
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
    </div>
  );
}
