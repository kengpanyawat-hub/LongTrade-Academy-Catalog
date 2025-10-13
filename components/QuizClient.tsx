// components/QuizClient.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/** ---------- Flexible Types ---------- */
// ช้อยส์รองรับทั้ง string หรือ object ที่มี label/text/title
export type Choice =
  | string
  | {
      id?: string | number;
      label?: string;
      text?: string;
      title?: string;
    };

// คำถามรองรับ q ได้ทั้ง string หรือ object ที่มี label/text/title/q
export type QuizQuestion = {
  q:
    | string
    | {
        id?: string | number;
        label?: string;
        text?: string;
        title?: string;
        q?: string;
      };
  choices: Choice[];
  /** คำตอบที่ถูกต้อง — รองรับ index (number), id (string/number), หรืออักษรตัวเลือก A/B/C/... */
  answer: number | string;
  explain?: string;
};

function pickLabel(x: any): string {
  if (x == null) return "";
  if (typeof x === "string") return x;
  return String(x.label ?? x.text ?? x.title ?? x.q ?? "");
}

function choiceId(choice: Choice, idx: number): string {
  return typeof choice === "string" ? String(idx) : String(choice.id ?? idx);
}

function letterToIndex(letter: string): number {
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alpha.indexOf(letter.trim().toUpperCase());
}

export default function QuizClient({
  slug,
  courseTitle,
  questions,
  passScore,
}: {
  slug: string;
  courseTitle: string;
  questions: QuizQuestion[];
  passScore: number;
}) {
  const router = useRouter();

  // เก็บคำตอบเป็น id ของช้อยส์
  const [answers, setAnswers] = useState<string[]>(
    Array(questions.length).fill("")
  );
  const [showResult, setShowResult] = useState(false);

  // อนุญาตให้ปลดล็อกจาก 2 คีย์ (เผื่อโค้ดเก่า)
  const unlocked = useMemo(() => {
    if (typeof window === "undefined") return false;
    const k1 = localStorage.getItem(`unlock:${slug}`) === "1";
    const k2 = localStorage.getItem(`lt_course_${slug}_unlocked`) === "1";
    return k1 || k2;
  }, [slug]);

  const score = useMemo(() => {
    return questions.reduce((sum, q, qi) => {
      const ids = q.choices.map((c, idx) => choiceId(c, idx));

      let correctId = "";
      if (typeof q.answer === "number") {
        correctId = ids[q.answer] ?? "";
      } else {
        const asStr = String(q.answer).trim();
        const idxFromLetter = letterToIndex(asStr);
        if (idxFromLetter >= 0 && idxFromLetter < ids.length) {
          correctId = ids[idxFromLetter];
        } else {
          correctId = asStr; // เป็น id ตรงๆ
        }
      }

      return answers[qi] === correctId ? sum + 1 : sum;
    }, 0);
  }, [answers, questions]);

  if (!unlocked) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">ทำแบบทดสอบ</h1>
        <p className="mt-2 text-white/80">
          ต้องปลดล็อกคอร์สก่อนจึงจะทำแบบทดสอบได้
        </p>
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

  const submit = () => {
    if (answers.some((v) => !v)) {
      alert("กรุณาตอบให้ครบทุกข้อก่อนส่งคำตอบ");
      return;
    }
    setShowResult(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(`lt_course_${slug}_quiz_done`, "1");
      localStorage.setItem(`lt_course_${slug}_quiz_score`, String(score));
    }
  };

  const reset = () => {
    setAnswers(Array(questions.length).fill(""));
    setShowResult(false);
  };

  const passed = score >= passScore;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">
          แบบทดสอบ: {courseTitle}
        </h1>
        <p className="mt-1 text-white/80">
          ตอบคำถามทั้งหมด {questions.length} ข้อ เกณฑ์ผ่าน {passScore} คะแนนขึ้นไป
        </p>
      </div>

      {!showResult ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-6">
          {questions.map((q, i) => {
            const ids = q.choices.map((c, idx) => choiceId(c, idx));
            return (
              <div key={i} className="space-y-3">
                <div className="font-semibold">
                  {i + 1}. {pickLabel(q.q)}
                </div>

                <div className="grid gap-2">
                  {q.choices.map((c, idx) => {
                    const idVal = ids[idx];
                    const checked = answers[i] === idVal;
                    const inputId = `q${i}_${idVal}`;
                    return (
                      <label
                        key={inputId}
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
                            next[i] = idVal;
                            setAnswers(next);
                          }}
                        />
                        <span>{pickLabel(c)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

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
            ผลคะแนน: {score} / {questions.length} {passed ? "✅ ผ่าน" : "❌ ไม่ผ่าน"}
          </div>

          <div className="space-y-4">
            {questions.map((q, i) => {
              const ids = q.choices.map((c, idx) => choiceId(c, idx));
              const labels = q.choices.map((c) => pickLabel(c));

              // หา correctId อีกครั้ง
              let correctId = "";
              if (typeof q.answer === "number") {
                correctId = ids[q.answer] ?? "";
              } else {
                const asStr = String(q.answer).trim();
                const idxFromLetter = letterToIndex(asStr);
                if (idxFromLetter >= 0 && idxFromLetter < ids.length) {
                  correctId = ids[idxFromLetter];
                } else {
                  correctId = asStr;
                }
              }

              const isCorrect = answers[i] === correctId;
              const yourLabel =
                labels[ids.findIndex((v) => v === answers[i])] ?? "-";
              const correctLabel =
                labels[ids.findIndex((v) => v === correctId)] ?? "-";

              return (
                <div
                  key={i}
                  className={`rounded-xl border p-4 ${
                    isCorrect
                      ? "border-emerald-400/40 bg-emerald-400/10"
                      : "border-rose-400/40 bg-rose-400/10"
                  }`}
                >
                  <div className="font-semibold">
                    {i + 1}. {pickLabel(q.q)}
                  </div>
                  <div className="mt-1 text-sm">
                    คำตอบของคุณ:{" "}
                    <span className="font-medium">{yourLabel}</span>{" "}
                    {isCorrect ? "✅ ถูกต้อง" : "❌ ไม่ถูกต้อง"}
                  </div>
                  {!isCorrect && (
                    <div className="text-sm">
                      คำตอบที่ถูก:{" "}
                      <span className="font-medium">{correctLabel}</span>
                    </div>
                  )}
                  {q.explain && (
                    <div className="text-sm text-white/80 mt-1">
                      {q.explain}
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
