"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useMemo } from "react";

export default function CertificatePage() {
  const params = useParams<{ slug: string }>();
  const sp = useSearchParams();

  const score = Number(sp.get("score") || 0);
  const total = Number(sp.get("total") || 0);
  const course = decodeURIComponent(sp.get("course") || "");
  const dateText = new Date().toLocaleString("th-TH", {
    dateStyle: "long",
    timeStyle: "short",
  });

  // gen เลขอ้างอิงใบยืนยันผลแบบอ่านง่าย (ไม่ต้องเก็บ DB)
  const certId = useMemo(() => {
    const seed = Date.now().toString(36).toUpperCase().slice(-6);
    return `LTA-${seed}`;
  }, []);

  const printDoc = () => window.print();

  return (
    <main className="container-narrow py-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] overflow-hidden print:border-0 print:bg-white">
        {/* หัวกระดาษ */}
        <header className="relative p-6 md:p-8 bg-gradient-to-br from-rose-700/40 to-black/40 print:bg-white print:text-black">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs opacity-80">Longtrade Academy</div>
              <h1 className="text-2xl md:text-3xl font-extrabold">
                ใบยืนยันผลคะแนนแบบทดสอบ
              </h1>
            </div>
            <div className="rounded-xl border border-white/15 px-3 py-1 text-sm print:border-black/20 print:text-black">
              รหัสเอกสาร: {certId}
            </div>
          </div>
          <div className="mt-2 text-white/80 text-sm print:text-black">
            ออกให้เมื่อ: {dateText}
          </div>
        </header>

        {/* ตัวเนื้อหา */}
        <section className="p-6 md:p-8 print:text-black">
          <div className="space-y-3">
            <div className="text-sm opacity-80">คอร์ส</div>
            <div className="text-xl md:text-2xl font-bold">{course}</div>

            <div className="h-px bg-white/10 my-4 print:bg-black/10" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 p-4 print:border-black/20">
                <div className="text-sm opacity-80">ผลคะแนน</div>
                <div className="text-2xl font-extrabold">
                  {score} / {total}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 p-4 print:border-black/20">
                <div className="text-sm opacity-80">สถานะ</div>
                <div
                  className={`text-2xl font-extrabold ${
                    score >= Math.ceil(total * 0.6)
                      ? "text-emerald-400 print:text-green-700"
                      : "text-rose-400 print:text-red-700"
                  }`}
                >
                  {score >= Math.ceil(total * 0.6) ? "ผ่าน" : "ไม่ผ่าน"}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 p-4 print:border-black/20">
                <div className="text-sm opacity-80">สังกัด</div>
                <div className="text-2xl font-extrabold">Longtrade Academy</div>
              </div>
            </div>

            <p className="mt-4 text-white/80 print:text-black">
              เอกสารฉบับนี้ใช้ยืนยันผลคะแนนการทำแบบทดสอบของคอร์สด้านบน
              ผู้เรียนสามารถพิมพ์/บันทึกเป็นไฟล์และส่งให้เจ้าหน้าที่ทาง LINE
              เพื่อขอรับใบ Certificate อย่างเป็นทางการจากสถาบัน
            </p>
          </div>

          {/* ปุ่มใช้งาน – ซ่อนตอนพิมพ์ */}
          <div className="mt-6 flex flex-wrap gap-3 print:hidden">
            <button
              onClick={printDoc}
              className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/15"
            >
              พิมพ์ใบยืนยันผลคะแนน
            </button>
            <a
              href="https://line.me/ti/p/~longtrade"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl px-4 py-2 bg-emerald-600 hover:bg-emerald-500 font-semibold"
            >
              ติดต่อขอรับใบเซอร์ (LINE)
            </a>
            <a
              href={`/courses/${params.slug}`}
              className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/15"
            >
              กลับไปหน้าคอร์ส
            </a>
          </div>
        </section>
      </div>

      {/* สไตล์สำหรับโหมดพิมพ์ */}
      <style jsx global>{`
        @media print {
          body {
            background: #fff !important;
          }
          .container-narrow {
            padding: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}
