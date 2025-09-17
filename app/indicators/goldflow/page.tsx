// app/indicators/goldflow/page.tsx
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GOLDFLOW Indicator | Longtrade Academy",
  description:
    "อินดิเคเตอร์กลยุทธ์แนว MA Crossover/Trend-Follow แบบใช้งานง่าย พร้อมวิดีโอเดโม่ รีวิวผู้ใช้จริง และลิงก์ติดต่อ",
};

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

export default function GoldflowPage() {
  const [rowA, rowB] = splitRows(REVIEWS);

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
                GOLDFLOW SYSTEM
              </h1>
              <p className="mt-4 text-white/85">
                กลยุทธ์ที่ออกแบบมาให้เห็นภาพแนวโน้มและจังหวะเข้าออกชัดเจน
                เหมาะกับเทรดเดอร์สาย Trend-Follow และ Swing
              </p>
              <ul className="mt-4 space-y-2 text-white/80 list-disc ml-5">
                <li>MA Cross + โซนสนับสนุนด้วยสัญญาณยืนยัน</li>
                <li>แสดง TP/SL/Entry ช่วยวางแผนได้ไว</li>
                <li>ใช้งานง่ายบนชาร์ต ดูจบในพาเนลเดียว</li>
              </ul>

              <div className="mt-6 flex items-center gap-3 flex-wrap">
                <a
                  href="https://line.me/ti/p/~longtrade"
                  target="_blank"
                  className="btn-line"
                >
                  LINE สั่งซื้อ/สอบถาม
                </a>
                <Link
                  href="#reviews"
                  className="glass px-4 py-2 rounded-full border border-white/10"
                >
                  ดูรีวิวผู้ใช้จริง
                </Link>
              </div>
            </div>

            <VideoPlayer
              className="relative"
              src="https://ik.imagekit.io/pcqgvgpgi1/playback-1.mp4"
              poster="https://ik.imagekit.io/pcqgvgpgi1/bg%20graph.jpg"
            />
          </div>
        </section>

        {/* จุดเด่น */}
        <section className="grid md:grid-cols-3 gap-6">
          {[
            ["เข้าใจง่าย", "UI ชัด จังหวะเข้า/ออกชัดเจน ลดความลังเล"],
            ["ครบในจอเดียว", "มี TP/SL/Entry + คำอธิบาย ช่วยตัดสินใจไว"],
            ["ยืดหยุ่น", "เหมาะทั้ง Day trade / Swing / Position"],
          ].map(([t, d]) => (
            <div key={t} className="glass p-6 rounded-2xl border border-white/10">
              <div className="text-xl font-semibold">{t}</div>
              <div className="opacity-80 mt-1">{d}</div>
            </div>
          ))}
        </section>

        {/* ตัวอย่างหน้าจอ */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">ตัวอย่างหน้าจอ</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "https://ik.imagekit.io/pcqgvgpgi1/Indicators.jpg",
              "https://ik.imagekit.io/pcqgvgpgi1/Indicators.jpg",
              "https://ik.imagekit.io/pcqgvgpgi1/Indicators.jpg",
            ].map((src, i) => (
              <div key={i} className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src={`${src}?v=${i}`}
                  alt={`goldflow screenshot ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Smart Money Toolkit */}
        <section className="relative overflow-hidden rounded-3xl p-6 md:p-10 bg-white/[0.04] border border-white/10 backdrop-blur-sm">
          <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(55%_45%_at_10%_10%,rgba(255,0,0,.14),transparent_65%),radial-gradient(55%_45%_at_90%_90%,rgba(255,70,70,.18),transparent_65%)]" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold">Smart Money Toolkit</h2>
            <p className="mt-2 text-white/85">
              จับจังหวะก่อนตลาดเคลื่อน — ด้วยเครื่องมือช่วยดูโครงสร้าง, FVGs, Liquidity Sweep และ Dynamic Screener
            </p>
            <p className="mt-1 text-white/70">
              วิเคราะห์โครงสร้างตลาด ติดตาม Footprints ของสถาบัน และสแกนหาเซ็ตอัพที่แข็งแรง ครอบคลุมตลาดหลักทั้งหมด
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "https://smrtalgo.com/wp-content/uploads/2024/11/Screenshot-2024-10-26-at-12.19.08OCPM-2048x916.png",
                "https://smrtalgo.com/wp-content/uploads/2024/11/Screenshot-2024-10-26-at-12.19.49OCPM-650x292.png",
                "https://smrtalgo.com/wp-content/uploads/2024/11/Screenshot-2024-10-26-at-12.15.40OCPM-650x291.png",
                "https://smrtalgo.com/wp-content/uploads/2024/11/Screenshot-2024-10-26-at-12.16.08OCPM-650x288.png",
              ].map((src, i) => (
                <div key={i} className="relative w-full aspect-[16/9]">
                  <Image
                    src={src}
                    alt={`goldflow toolkit ${i + 1}`}
                    fill
                    sizes="(min-width:1024px) 45vw, 95vw"
                    className="rounded-xl border border-white/10 object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                href="#contact"
                className="rounded-full px-5 py-3 bg-rose-600/90 hover:bg-rose-500 text-white font-semibold transition"
              >
                Explore Toolkit
              </Link>
            </div>
          </div>
        </section>

        {/* Automation & Backtesting */}
        <section className="relative overflow-hidden rounded-3xl p-6 md:p-10 bg-white/[0.04] border border-white/10 backdrop-blur-sm">
          <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(55%_45%_at_10%_10%,rgba(255,0,0,.12),transparent_65%),radial-gradient(55%_45%_at_90%_90%,rgba(255,70,70,.18),transparent_65%)]" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold">Automation &amp; Backtesting</h2>
            <p className="mt-2 text-white/85">
              ระบบช่วยเทรดความเสี่ยงต่ำ ออกแบบมาสำหรับการเข้า–ออกที่รวดเร็ว พร้อมผลการทดสอบย้อนหลังเพื่อยืนยันประสิทธิภาพ
            </p>
            <p className="mt-1 text-white/70">
              รองรับการเชื่อมต่อกับ Third-party และทำงานกับตลาดสำคัญทั้งคริปโต ฟิวเจอร์ส ฟอเร็กซ์ และทองคำ
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "https://smrtalgo.com/wp-content/uploads/2024/11/ss3-1-650x340.png",
                "https://smrtalgo.com/wp-content/uploads/2024/11/ss-2-650x340.png",
                "https://smrtalgo.com/wp-content/uploads/2024/11/ss4-1-650x340.png",
                "https://smrtalgo.com/wp-content/uploads/2024/11/ss6-650x340.png",
              ].map((src, i) => (
                <div key={i} className="relative w-full aspect-[16/9]">
                  <Image
                    src={src}
                    alt={`goldflow backtest ${i + 1}`}
                    fill
                    sizes="(min-width:1024px) 45vw, 95vw"
                    className="rounded-xl border border-white/10 object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                href="#contact"
                className="rounded-full px-5 py-3 bg-rose-600/90 hover:bg-rose-500 text-white font-semibold transition"
              >
                Learn More
              </Link>
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
          <h3 className="text-2xl md:text-3xl font-bold">
            พร้อมเริ่มใช้ GOLDFLOW แล้วหรือยัง?
          </h3>
          <div className="mt-5 flex items-center gap-3 justify-center">
            <a href="https://line.me/ti/p/~longtrade" target="_blank" className="btn-line">
              LINE สั่งซื้อ/สอบถาม
            </a>
            <Link href="/indicators" className="glass px-4 py-2 rounded-full border border-white/10">
              ดูอินดิเคเตอร์ทั้งหมด
            </Link>
          </div>
        </section>
      </main>

      {/* เปลี่ยนจาก <style jsx global> เป็น <style> ธรรมดา เพื่อให้ใช้ใน Server Component ได้ */}
      <style>{`
        .gf-row {
          overflow: hidden;
          position: relative;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%);
                  mask-image: linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%);
        }
        .gf-track {
          display: inline-flex;
          gap: 16px;
          will-change: transform;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          white-space: nowrap;
        }
        .gf-left  { animation-name: gf-marquee-left;  }
        .gf-right { animation-name: gf-marquee-right; }
        @keyframes gf-marquee-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes gf-marquee-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .gf-card {
          min-width: 300px;
          max-width: 540px;
        }
        @media (min-width: 768px) {
          .gf-card { min-width: 420px; }
        }
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
      <div
        className={`gf-track ${direction === "left" ? "gf-left" : "gf-right"}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((r, i) => (
          <div
            key={`${r.name}-${i}`}
            className="gf-card glass p-6 rounded-2xl border border-white/10"
          >
            <div className="opacity-90">{r.text}</div>
            <div className="mt-3 text-white/70 text-sm">— {r.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
