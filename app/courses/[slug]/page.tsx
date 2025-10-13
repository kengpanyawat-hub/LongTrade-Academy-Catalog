// app/courses/[slug]/page.tsx  (Server Component)
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { findCourse } from "@/data/courses";
import CourseDetailClient from "@/components/CourseDetailClient";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const course = findCourse(params.slug);
  return {
    title: course ? `${course.title} | Longtrade Academy` : "Course | Longtrade Academy",
  };
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = findCourse(params.slug);
  if (!course) {
    return (
      <>
        <Navbar />
        <main className="container-narrow pt-28 pb-16">ไม่พบคอร์ส</main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container-narrow pt-28 pb-16">
        {/* Cover + Title */}
        <div className="rounded-3xl overflow-hidden border border-white/10">
          <div className="relative h-[280px] md:h-[360px]">
            <Image src={course.cover} alt={course.title} fill className="object-cover" priority />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 bg-gradient-to-t from-black/60 to-transparent">
              <h1 className="text-2xl md:text-3xl font-extrabold">{course.title}</h1>
            </div>
          </div>
        </div>

        {/* Detail + Lessons (Client Part) */}
        <CourseDetailClient course={course} />
      </main>
    </>
  );
}
