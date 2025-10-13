// app/courses/[slug]/quiz/page.tsx
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import QuizClient, { QuizQuestion as UIQuizQuestion } from "@/components/QuizClient";
import { findCourse } from "@/data/courses";

type PageProps = {
  params: { slug: string };
};

export default function CourseQuizPage({ params }: PageProps) {
  const course = findCourse(params.slug);
  if (!course) return notFound();

  // แปลงโครงสร้างคำถามจาก data/courses → ให้ตรงกับ type ของ QuizClient
  const questions: UIQuizQuestion[] =
    course.quiz?.questions.map((q) => ({
      // แสดงข้อความคำถาม: ใช้ q.q.label (ถ้ามี) ไม่งั้น fallback เป็น q.title
      q: typeof q.q === "string" ? q.q : q.q?.label || q.title,
      // ช้อยส์เป็น object ที่มี label/id ได้ตามที่ QuizClient รองรับ
      choices: q.choices.map((c) => ({ id: c.id, label: c.label })),
      // ตอบเป็น id ของตัวเลือกที่ถูกต้องได้โดยตรง
      answer: q.answerId,
      // (ออปชัน) สามารถใส่คำอธิบายเพิ่มได้ ถ้ามี field อื่นๆ
      explain: undefined,
    })) ?? [];

  // แปลงเปอร์เซ็นต์ผ่าน → จำนวนข้อที่ต้องถูก
  // เช่น passingScore = 70 หมายถึงต้องถูกอย่างน้อย 70% ของจำนวนข้อทั้งหมด
  const mustCorrect =
    Math.max(1, Math.ceil(((course.quiz?.passingScore ?? 70) / 100) * questions.length));

  return (
    <main className="container-narrow py-6 space-y-6">
      <Navbar />
      <QuizClient
        slug={course.slug}
        courseTitle={`แบบทดสอบ: ${course.title}`}
        questions={questions}
        passScore={mustCorrect}
      />
    </main>
  );
}
