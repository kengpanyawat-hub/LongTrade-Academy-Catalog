// components/QuizClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/** -------- Types ที่ยืดหยุ่น -------- */
type Choice =
  | string
  | {
      id?: string | number;
      label?: string;
      text?: string;
      title?: string;
    };

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
  // รองรับ index | id | ตัวอักษร A/B/C/...
  answer: number | string;
  explain?: string;
};

/** -------- Helpers -------- */
function pickLabel(obj: any): string {
  if (obj == null) return "";
  if (typeof obj === "string") return obj;
  return String(obj.label ?? obj.text ?? obj.title ?? obj.q ?? "");
}
const choiceLabel = (c: Choice) => pickLabel(c);
const choiceId = (c: Choice, idx: number) =>
  typeof c === "string" ? String(idx) : String(c.id ?? idx);
const questionText = (q: QuizQuestion["q"]) => pickLabel(q);
const letterToIndex = (letter: string) =>
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(letter.trim().toUpperCase());

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

  /** ✅ ป้องกัน Hydration: รอให้เมานต์ก่อนค่อยเรนเดอร์จริง */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /** ✅ อ่าน localStorage เมื่ออยู่ฝั่ง Client เท่านั้น */
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    if (!mounted) return;
    const k1 = localStorage.getItem(`unlock:${slug}`) === "1";
    const k2 = localStorage.getItem(`lt_course_${slug}_unlocked`) === "1";
    setUnlocked(k1 || k2);
  }, [mounted, slug]);

  /** เก็บคำตอบเป็น id ของช้อยส์ */
  const qLen = questions?.length ?? 0;
  const [ansIds, setAnsIds] = useState<string[]>([]);
  useEffect(() => {
    // เซ็ตครั้งแรกหลังเมานต์ (กัน length เพี้ยนตอน SSR)
    if (mounted) setAnsIds(Array(qLen).fill(""));
  }, [mounted, qLen]);

  const [showResult, setShowResult] = useState(false);

  const score = useMemo(() => {
    if (!mounted) return 0;
    return questions.reduce((sum, q, i) => {
      const ids = q.choices.map((c, idx) => choiceId(c, idx));
      let correctId = "";

      if (typeof q.answer === "number") {
        correctId = ids[q.answer] ?? "";
      } else {
        const asString = String(q.answer).trim();
        const idxFromLetter = letterToIndex(asString);
        if (idxFromLetter >= 0 && idxFromLetter < ids.length) {
          correctId = ids[idxFromLetter];
        } else {
          // treat as id
          correctId = asString;
        }
      }

      return ansIds[i] === correctId ? sum + 1 : sum;
    }, 0);
  }, [mounted, ansIds, questions]);

  /** ---------------- Skeleton ชั่วคราวตอน SSR / ก่อนเมานต์ ---------------- */
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="h-6 w-48 bg-white/10 rounded mb-2" />
          <div className="h-4 w-72 bg-white/5 rounded" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="h-4 w-full bg-white/5 rounded mb-3" />
          <div className="h-4 w-11/12 bg-white/5 rounded mb-3" />
          <div className="h-4 w-10/12 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  /** ---------------- UI หลังเมานต์แล้ว (DOM Server/Client ตรงกัน) ---------------- */
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

  const submit = () => {
    if (ansIds.length !== qLen || ansIds.some((v) => !v)) {
      alert("กรุณาตอบให้ครบทุกข้อก่อนส่งคำตอบ");
      return;
    }
    setShowResult(true);
    localStorage.setItem(`lt_course_${slug}_quiz_done`, "1");
    localStorage.setItem(`lt_course_${slug}_quiz_score`, String(score));
  };

  const reset = () => {
    setAnsIds(Array(qLen).fill(""));
    setShowResult(false);
  };

  const passed = score >= passScore;

  return (
    <div className="space-y-6">
      <div className="rounded-2zl border border-white/10 bg-white/[0.04] p-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">แบบทดสอบ: {courseTitle}</h1>
        <p className="mt-1 text-white/80">
          ตอบคำถามทั้งหมด {qLen} ข้อ เกณฑ์ผ่าน {passScore} คะแนนขึ้นไป
        </p>
      </div>

      {!showResult ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-6">
          {questions.map((q, i) => {
            const ids = q.choices.map((c, idx) => choiceId(c, idx));
            return (
              <div key={i} className="space-y-3">
                <div className="font-semibold">
                  {i + 1}. {questionText(q.q)}
                </div>

                <div className="grid gap-2">
                  {q.choices.map((c, idx) => {
                    const idVal = ids[idx];
                    const checked = ansIds[i] === idVal;
                    const inputId = `q${i}_${idVal}`;
                    return (
                      <label
                        htmlFor={inputId}
                        key={inputId}
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
                            const next = [...ansIds];
                            next[i] = idVal;
                            setAnsIds(next);
                          }}
                        />
                        <span>{choiceLabel(c)}</span>
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
            ผลคะแนน: {score} / {qLen} {passed ? "✅ ผ่าน" : "❌ ไม่ผ่าน"}
          </div>

          <div className="space-y-4">
            {questions.map((q, i) => {
              const ids = q.choices.map((c, idx) => choiceId(c, idx));
              const labels = q.choices.map((c) => choiceLabel(c));

              let correctId = "";
              if (typeof q.answer === "number") {
                correctId = ids[q.answer] ?? "";
              } else {
                const asString = String(q.answer).trim();
                const idxFromLetter = letterToIndex(asString);
                correctId =
                  idxFromLetter >= 0 && idxFromLetter < ids.length
                    ? ids[idxFromLetter]
                    : asString;
              }

              const isCorrect = ansIds[i] === correctId;
              const yourLabel = labels[ids.findIndex((v) => v === ansIds[i])] ?? "-";
              const correctLabel = labels[ids.findIndex((v) => v === correctId)] ?? "-";

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
                    {i + 1}. {questionText(q.q)}
                  </div>
                  <div className="mt-1 text-sm">
                    คำตอบของคุณ: <span className="font-medium">{yourLabel}</span>{" "}
                    {isCorrect ? "✅ ถูกต้อง" : "❌ ไม่ถูกต้อง"}
                  </div>
                  {!isCorrect && (
                    <div className="text-sm">
                      คำตอบที่ถูก: <span className="font-medium">{correctLabel}</span>
                    </div>
                  )}
                  {q.explain && (
                    <div className="text-sm text-white/80 mt-1">{q.explain}</div>
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
