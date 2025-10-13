// app/courses/[slug]/exam/ExamClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Course } from "@/data/courses";

type Props = {
  course: Course;
  slug: string;
};

export default function ExamClient({ course, slug }: Props) {
  const router = useRouter();

  // ====== แก้จาก course.exam -> course.quiz ======
  const quiz = course.quiz; // ปลอดภัยกว่าและสื่อความหมายชัด

  // ปลดล็อกจาก localStorage ได้ทั้ง key เก่า/ใหม่
  const unlocked = useMemo(() => {
    if (typeof window === "undefined") return false;
    const k1 = localStorage.getItem(`unlock:${slug}`) === "1";
    const k2 = localStorage.getItem(`lt_course_${slug}_unlocked`) === "1";
    return k1 || k2;
  }, [slug]);

  // จำนวนข้อ
  const len = quiz?.questions?.length || 0;

  // เก็บคำตอบแบบ index (-1 = ยังไม่เลือก)
  const [answers, setAnswers] = useState<number[]>(Array(len).fill(-1));
  const [showResult, setShowResult] = useState(false);

  // ป้องกันกรณีเปลี่ยนคอร์ส/รีเฟรช
  useEffect(() => {
    setAnswers(Array(len).fill(-1));
  }, [len]);

  // หา index ของคำตอบที่ถูกจาก answerId (ใน data/courses ใช้ id ของช้อยส์)
  const getCorrectIndex = (qIdx: number): number => {
    const q = quiz.questions[qIdx];
    const idx = q.choices.findIndex((c) => c.id === q.answerId);
    return idx === -1 ? 0 : idx;
  };

  const score = useMemo(() => {
    if (!quiz) return 0;
    return answers.reduce((sum, a, i) => (a === getCorrectIndex(i) ? sum + 1 : sum), 0);
  }, [answers, quiz]);

  const passed = score >= (quiz?.passingScore ?? 0);

  const submit = () => {
    if (answers.some((a) => a < 0)) {
      alert("กรุณาตอบให้ครบทุกข้อ");
      return;
    }
    setShowResult(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(`lt_course_${slug}_quiz_done`, "1");
      localStorage.setItem(`lt_course_${slug}_quiz_score`, String(score));
    }
  };

  const reset = () => {
    setAnswers(Array(len).fill(-1));
    setShowResult(false);
  };

  if (!quiz) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        ไม่พบแบบทดสอบของคอร์สนี้
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">ทำแบบทดสอบ</h1>
        <p className="mt-2 text-white/80">ต้องปลดล็อกคอร์สก่อนจึงจะทำแบบทดสอบได้</p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => router.push(`/courses/${slug}`)}
            className="rounded-xl px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold"
          >
            กลับไปปลดล็อกคอร์ส
          </button>
          <a
            href="https://line.me/ti/p/~longtrade"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl px-4 py-2 bg-white/10 border border-white/20"
          >
            ติดต่อเพื่อรับรหัส
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">
          แบบทดสอบ: {course.title}
        </h1>
        <p className="mt-1 text-white/80">
          ตอบ {len} ข้อ เกณฑ์ผ่าน {quiz.passingScore} คะแนนขึ้นไป
        </p>
      </div>

      {!showResult ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-6">
          {quiz.questions.map((q, i) => (
            <div key={q.id} className="space-y-3">
              <div className="font-semibold">
                {i + 1}. {q.q && typeof q.q === "object" ? q.q.label : q.title}
              </div>

              <div className="grid gap-2">
                {q.choices.map((c, idx) => {
                  const checked = answers[i] === idx;
                  const inputId = `q${i}_${c.id}`;
                  return (
                    <label
                      key={c.id}
                      htmlFor={inputId}
                      className={`flex items-center gap-2 rounded-xl border p-3 cursor-pointer ${
                        checked
                          ? "border-rose-500 bg-rose-500/10"
                          : "border-white/10 bg-white/[0.02]"
                      }`}
                    >
                      <input
                        id={inputId}
                        type="radio"
                        name={`q${i}`}
                        className="accent-rose-500"
                        checked={checked}
                        onChange={() => {
                          const next = [...answers];
                          next[i] = idx;
                          setAnswers(next);
                        }}
                      />
                      <span>{c.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pt-2">
            <button
              onClick={submit}
              className="rounded-xl px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold"
            >
              ส่งคำตอบ
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-4">
          <div className="text-xl font-bold">
            ผลคะแนน: {score} / {len} {passed ? "✅ ผ่าน" : "❌ ไม่ผ่าน"}
          </div>

          <div className="space-y-4">
            {quiz.questions.map((q, i) => {
              const correctIdx = getCorrectIndex(i);
              const isCorrect = answers[i] === correctIdx;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl border p-4 ${
                    isCorrect
                      ? "border-emerald-400/40 bg-emerald-400/10"
                      : "border-rose-400/40 bg-rose-400/10"
                  }`}
                >
                  <div className="font-semibold">
                    {i + 1}. {q.q && typeof q.q === "object" ? q.q.label : q.title}
                  </div>
                  <div className="mt-1 text-sm">
                    คำตอบของคุณ:{" "}
                    <span className="font-medium">
                      {q.choices[answers[i]]?.label ?? "-"}
                    </span>{" "}
                    {isCorrect ? "✅ ถูกต้อง" : "❌ ไม่ถูกต้อง"}
                  </div>
                  {!isCorrect && (
                    <div className="text-sm">
                      คำตอบที่ถูก:{" "}
                      <span className="font-medium">
                        {q.choices[correctIdx]?.label ?? "-"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={reset}
              className="rounded-xl px-4 py-2 bg-white/10 border border-white/20"
            >
              ทำใหม่อีกครั้ง
            </button>

            {passed ? (
              <button
                onClick={() => router.push(`/courses/${slug}/certificate`)}
                className="rounded-xl px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
              >
                รับใบเซอร์ (Certificate)
              </button>
            ) : (
              <button
                onClick={() => router.push(`/courses/${slug}`)}
                className="rounded-xl px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold"
              >
                กลับไปทบทวนคอร์ส
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
