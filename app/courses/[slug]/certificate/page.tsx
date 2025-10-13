// app/courses/[slug]/certificate/page.tsx
import Navbar from "@/components/Navbar";
import { findCourse } from "@/data/courses";

export default function CertificatePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { score?: string };
}) {
  const course = findCourse(params.slug);
  const score = Number(searchParams?.score || 0);

  if (!course) return <div className="container-narrow pt-28">ไม่พบคอร์ส</div>;

  return (
    <>
      <Navbar />
      <main className="container-narrow pt-28 pb-16">
        <div className="glass p-6 rounded-2xl border border-white/10">
          <h1 className="text-2xl md:text-3xl font-extrabold">ขอรับ Certificate</h1>
          <p className="mt-2 text-white/80">
            ยินดีด้วย! คุณผ่านแบบทดสอบของคอร์ส <b>{course.title}</b> ด้วยคะแนน {score}%.
          </p>
          <p className="mt-2 text-white/70">
            กดปุ่มด้านล่างเพื่อยืนยันการออก Certificate จากทีมงาน Longtrade Academy
          </p>

          <a
            href={`https://line.me/ti/p/~longtrade`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 font-semibold"
          >
            ติดต่อรับ Certificate (LINE)
          </a>
        </div>
      </main>
    </>
  );
}
