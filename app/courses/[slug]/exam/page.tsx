// app/courses/[slug]/exam/page.tsx
import Navbar from "@/components/Navbar";
import ExamClient from "./ExamClient";
import { findCourse } from "@/data/courses";
import { notFound } from "next/navigation";

type PageProps = {
  params: { slug: string };
};

export default function Page({ params }: PageProps) {
  const { slug } = params;
  const course = findCourse(slug);

  if (!course) {
    // หาก slug ไม่ตรงกับคอร์สไหน ให้ 404 ไปเลย
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="container-narrow pt-28 pb-16">
        {/* ส่งพร็อพที่ ExamClient คาดหวัง */}
        <ExamClient course={course} slug={slug} />
      </main>
    </>
  );
}
