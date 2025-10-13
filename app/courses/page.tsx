// app/courses/page.tsx  (Server Component; no styled-jsx)
// ✅ ไม่มี <style jsx> แล้ว จึงไม่ดึง client-only ใน server อีก
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { courses } from "@/data/courses";

export const metadata = {
  title: "คอร์สเรียน | Longtrade Academy",
};

export default function CoursesPage() {
  // ใช้รูปปกของคอร์สแรกเป็นภาพ Hero เพื่อเลี่ยงโดเมนภาพที่ยังไม่ได้ allow
  const heroCover = courses[0]?.cover;

  return (
    <>
      <Navbar />

      <main className="container-narrow pt-28 pb-16 space-y-12">
        {/* HERO */}
        <section className="rounded-3xl border border-white/10 p-8 md:p-12 bg-white/[0.04] relative overflow-hidden">
          <div className="pointer-events-none absolute -inset-16 rounded-[32px] bg-[radial-gradient(55%_45%_at_10%_10%,rgba(255,0,0,.18),transparent_65%),radial-gradient(55%_45%_at_90%_90%,rgba(255,70,70,.22),transparent_65%)]" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                ยกระดับทักษะของคุณ
                <br />
                สู่โลกอนาคต
              </h1>
              <p className="mt-3 text-white/80">
                คอร์สคุณภาพจากผู้เชี่ยวชาญตัวจริง เนื้อหาเป็นระบบ
                พร้อมแบบฝึกหัดและรีวิวผลลัพธ์
              </p>
              <div className="mt-5 flex gap-2">
                <a
                  href="#list"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-[0_8px_28px_rgba(244,63,94,.35)] transition"
                >
                  เริ่มต้นเรียน
                </a>
                <a
                  href="https://line.me/ti/p/~longtrade"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/15 transition"
                >
                  ติดต่อ/สอบถาม
                </a>
              </div>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
              {heroCover ? (
                <Image src={heroCover} alt="Hero" fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-rose-500/30 to-rose-700/30" />
              )}
            </div>
          </div>
        </section>
		
		{/* SUB HERO */}
      <section className="rounded-3xl border border-white/10 p-6 md:p-8 bg-white/[0.04]">
        <h2 className="text-2xl md:text-3xl font-extrabold">
          ทำไมต้องเลือก <span className="text-rose-400">Longtrade Academy</span>
        </h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-5 border border-white/10">
            <div className="font-semibold mb-1">หลักสูตรมีมาตรฐาน</div>
            <div className="text-white/80 text-sm">
              ออกแบบจากการทำงานจริง นำไปใช้ได้ทันที
            </div>
          </div>
          <div className="glass rounded-2xl p-5 border border-white/10">
            <div className="font-semibold mb-1">มีแบบการฝึกอย่างเป็นระบบ</div>
            <div className="text-white/80 text-sm">
              เช็คสกิล/รีวิวผลลัพธ์อย่างต่อเนื่อง
            </div>
          </div>
          <div className="glass rounded-2xl p-5 border border-white/10">
            <div className="font-semibold mb-1">โค้ชแบบเอ็กซ์คูลซีฟ</div>
            <div className="text-white/80 text-sm">
              พร้อมซัพพอร์ตตามเป้าหมายส่วนบุคคล
            </div>
          </div>
        </div>
      </section>

        {/* LIST */}
        <section id="list" className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold">คอร์สทั้งหมด</h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((c) => (
              <Link
                key={c.slug}
                href={`/courses/${c.slug}`}
                className="group rounded-2xl border border-white/10 overflow-hidden bg-white/[0.03] hover:bg-white/[0.06] transition"
              >
                <div className="relative h-48 border-b border-white/10">
                  <Image src={c.cover} alt={c.title} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <div className="text-lg font-semibold group-hover:underline">
                    {c.title}
                  </div>
                  <div className="mt-1 text-sm text-white/70">
                    ทุกระดับ · {c.hours}
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <div className="text-rose-400 font-bold">
                      ฿{c.price.toLocaleString()}
                    </div>
                    {c.originalPrice && (
                      <div className="text-xs text-white/60 line-through">
                        ฿{c.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
