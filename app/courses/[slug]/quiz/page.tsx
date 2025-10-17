// app/courses/[slug]/quiz/page.tsx
import { courses } from "@/data/courses";
import QuizClient, {
  type QuizQuestion as ClientQuizQuestion,
} from "./QuizClient";
import Navbar from "@/components/Navbar";

type Params = { params: { slug: string } };

// แปลงรูปแบบข้อสอบจาก data/courses → รูปแบบที่ QuizClient ต้องการ
function toClientQuestions(
  raw:
    | {
        id: string;
        title: string;
        q?: string | { label: string };
        choices: { id: string; label: string }[];
        answerId: string;
      }[]
    | undefined
): ClientQuizQuestion[] {
  if (!raw || !raw.length) return [];
  return raw.map((q) => {
    const questionText =
      typeof q.q === "string"
        ? q.q
        : q.q?.label || q.title || "คำถาม";

    const choices = q.choices.map((c) => c.label);

    // หา index ของช้อยส์ที่ถูกต้องจาก answerId
    let answerIndex = q.choices.findIndex((c) => c.id === q.answerId);
    if (answerIndex < 0) answerIndex = 0; // กันกรณีข้อมูลผิด

    const clientQ: ClientQuizQuestion = {
      q: questionText,
      choices,
      answer: answerIndex, // QuizClient รองรับเป็น index ได้
    };
    return clientQ;
  });
}

// ข้อสอบสำรอง (กรณีคอร์สยังไม่มีข้อมูล quiz ใน data/courses)
const FALLBACK_QUESTIONS: ClientQuizQuestion[] = [
  {
    q: "หัวใจของการพัฒนาเว็บแบบ Full-Stack คืออะไร?",
    choices: ["รู้แค่ Frontend", "รู้แค่ Backend", "เข้าใจทั้งระบบตั้งแต่ UI จนถึงฐานข้อมูล"],
    answer: 2,
  },
  {
    q: "React ใช้สำหรับอะไรเป็นหลัก?",
    choices: ["จัดการฐานข้อมูล", "สร้าง UI แบบ component", "ทำ Reverse Proxy"],
    answer: 1,
  },
];

export default function QuizPage({ params: { slug } }: Params) {
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    return (
      <main className="container-narrow py-10">
        <Navbar />
        <div className="mt-6 rounded-2xl border border-white/10 p-6 bg-white/[0.04]">
          ไม่พบคอร์สที่ต้องการ
        </div>
      </main>
    );
  }

  const questionsFromData = toClientQuestions(course.quiz?.questions);
  const questions =
    questionsFromData.length > 0 ? questionsFromData : FALLBACK_QUESTIONS;

  const passScore =
    typeof course.quiz?.passingScore === "number"
      ? Math.ceil((course.quiz.passingScore / 100) * questions.length)
      : Math.ceil(0.7 * questions.length); // ดีฟอลต์ 70%

  return (
    <main className="container-narrow py-8 space-y-6">
      <Navbar />
      <QuizClient
        slug={course.slug}
        courseTitle={course.title}
        questions={questions}
        passScore={passScore}
      />
    </main>
  );
}
