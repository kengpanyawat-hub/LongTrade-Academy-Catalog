// app/courses/[slug]/quiz/page.tsx
import Navbar from "@/components/Navbar";
import { findCourse } from "@/data/courses";
import QuizClient, { type QuizQuestion } from "./QuizClient";

/** แปลง quiz จาก data/courses (ใช้ answerId) → รูปแบบ QuizClient (ใช้ answer เป็น index) */
function transformFromCourse(course: ReturnType<typeof findCourse> | undefined): QuizQuestion[] | null {
  if (!course || !course.quiz || !Array.isArray(course.quiz.questions)) return null;

  try {
    const questions: QuizQuestion[] = course.quiz.questions.map((q: any) => {
      const text =
        q?.q ??
        q?.title ??
        (typeof q === "object" ? q?.label ?? q?.text ?? "" : String(q ?? ""));
      const choices: string[] = (q?.choices ?? []).map((c: any) =>
        typeof c === "object" ? c?.label ?? c?.text ?? c?.title ?? String(c?.id ?? "") : String(c ?? "")
      );
      const idx = Math.max(
        0,
        choices.findIndex((c: any, i: number) =>
          String(q?.answerId ?? q?.answer ?? -1) === String(i) // เผื่อบางโครงเก็บเป็น index อยู่แล้ว
        )
      );
      // ถ้า findIndex ไม่เจอ และมี answer เป็นตัวเลข ให้ใช้ตรง ๆ
      const answerIndex =
        idx >= 0 && idx < choices.length
          ? idx
          : (typeof q?.answer === "number" ? q.answer : 0);

      return { q: text, choices, answer: answerIndex };
    });
    return questions;
  } catch {
    return null;
  }
}

/** helper: แปลงชุดคำถามที่ส่งมาในรูปแบบ {q, choices, correct} → {q, choices, answer} */
type BuildItem = { q: string; choices: string[]; correct: number };
function build(items: BuildItem[]): QuizQuestion[] {
  return items.map(({ q, choices, correct }) => ({
    q,
    choices,
    answer: correct,
  }));
}

type Params = { params: { slug: string } };

export default async function QuizPage({ params: { slug } }: Params) {
  const course = findCourse(slug);

  if (!course) {
    return (
      <>
        <Navbar />
        <main className="container-narrow pt-28 pb-16">
          <h1 className="text-2xl md:text-3xl font-extrabold">ไม่พบคอร์ส</h1>
          <p className="opacity-80 mt-2">กรุณากลับไปเลือกคอร์สอีกครั้ง</p>
        </main>
      </>
    );
  }

  /** ----------------------------------------------------------------
   *  ชุดคำถามตาม 3 คอร์สแรกที่ผู้ใช้กำหนด
   *  NOTE: เทียบด้วย course.title เพื่อความชัด (เปลี่ยนเป็น slug ได้)
   *  ---------------------------------------------------------------- */
  let questions: QuizQuestion[] | undefined;

  // 1) One day Gold Trading
  if (course.title.trim() === "One day Gold Trading - คอร์สเร่งรัดเทรดทองเป็นใน 1 วัน") {
    questions = build([
      {
        q: "“เทรดทองคำออนไลน์” หมายถึงอะไร?",
        choices: [
          "ซื้อทองแท่งเก็บไว้จริง",
          "ซื้อขายทองคำผ่านตลาดออนไลน์เพื่อเก็งกำไรจากราคา",
          "แลกทองคำจริงกับนักเทรดในต่างประเทศ",
          "ซื้อทองจากร้านทองในรูปแบบผ่อนรายเดือน",
        ],
        correct: 1,
      },
      {
        q: "ทำไมการเทรดทองออนไลน์ถึงไม่ต้องใช้เงินเต็มจำนวนของทองจริง?",
        choices: [
          "เพราะโบรกเกอร์ให้เทรดฟรี",
          "เพราะมีระบบ Leverage ที่ช่วยขยายกำลังซื้อ",
          "เพราะราคาทองออนไลน์ถูกกว่าทองจริง",
          "เพราะเทรดเฉพาะเวลาตลาดเอเชีย",
        ],
        correct: 1,
      },
      {
        q: "Margin คืออะไร?",
        choices: [
          "กำไรจากการเทรด",
          "เงินค่าธรรมเนียมที่จ่ายให้โบรกเกอร์",
          "เงินประกันที่ใช้เปิดออเดอร์เพื่อค้ำประกันการเทรด",
          "เงินส่วนลดที่ได้จากการเปิดบัญชีเทรด",
        ],
        correct: 2,
      },
      {
        q: "บัญชี Micro เหมาะกับใครมากที่สุด?",
        choices: [
          "นักลงทุนสถาบัน",
          "เทรดเดอร์ที่ต้องการทดสอบระบบหรือมีทุนน้อย",
          "เทรดเดอร์ที่มีทุนมากและต้องการกำไรเร็ว",
          "ผู้ที่ไม่ต้องการใช้ Leverage",
        ],
        correct: 1,
      },
      {
        q: "หากราคาทองกำลัง “ขาขึ้น” กลยุทธ์พื้นฐานคืออะไร?",
        choices: [
          "รอจังหวะ Buy เมื่อมีสัญญาณยืนยัน",
          "รอ Sell เพราะราคาน่าจะถึงจุดสูงสุดแล้ว",
          "หยุดเทรดจนกว่าจะกลับทิศ",
          "ใช้ Leverage สูงที่สุด",
        ],
        correct: 0,
      },
      {
        q: "Stop Loss มีหน้าที่อะไรในการเทรดทอง?",
        choices: [
          "ใช้เพิ่มขนาดสัญญา",
          "ใช้กำหนดจุดขาดทุนสูงสุดที่ยอมรับได้",
          "ใช้คำนวณค่า Spread",
          "ใช้เปิดออเดอร์อัตโนมัติเมื่อราคาขึ้น",
        ],
        correct: 1,
      },
      {
        q: "ข้อใด “ไม่ใช่” ปัจจัยที่มีผลต่อราคาทองคำในตลาดโลก?",
        choices: [
          "อัตราดอกเบี้ยของสหรัฐฯ",
          "ค่าเงินดอลลาร์สหรัฐฯ (USD)",
          "ราคาน้ำมันดิบโลก",
          "จำนวนร้านทองในประเทศไทย",
        ],
        correct: 3,
      },
      {
        q: "ถ้าต้องการ “ฝึกเทรด” โดยไม่ใช้เงินจริง ควรทำอย่างไร?",
        choices: [
          "เปิดบัญชีจริงแต่ใช้ทุนต่ำ",
          "ใช้บัญชีทดลอง (Demo Account)",
          "เทรดในแอปของเพื่อน",
          "เปิดบัญชีร่วมกับคนอื่น",
        ],
        correct: 1,
      },
      {
        q: "เทรดทอง “แบบมีแผน” ควรทำสิ่งใดก่อนกดออเดอร์?",
        choices: [
          "ตั้งเป้ากำไรอย่างเดียว",
          "ดูกราฟย้อนหลังอย่างเดียว",
          "เขียนแผนเทรดระบุจุดเข้า–ออก–ตัดขาดทุนให้ชัด",
          "ใช้ความรู้สึกและเดาแนวโน้มตลาด",
        ],
        correct: 2,
      },
      {
        q: "คำแนะนำที่ถูกต้องที่สุดสำหรับมือใหม่คือข้อใด?",
        choices: [
          "ใช้ Leverage สูงสุดเพื่อทำกำไรเร็ว",
          "เทรดตามเพื่อนทุกครั้ง",
          "เริ่มด้วยทุนเล็ก ฝึกในบัญชีทดลอง และเน้นวินัย",
          "เปิดออเดอร์หลายคู่พร้อมกันเพื่อลุ้นกำไรเยอะ",
        ],
        correct: 2,
      },
    ]);
  }

  // 2) เทคนิคการเทรดท่า 30MBO - เรียบง่ายแต่ทรงพลัง
  if (!questions && course.title.trim() === "เทคนิคการเทรดท่า 30MBO - เรียบง่ายแต่ทรงพลัง") {
    questions = build([
      {
        q: "30MBO ย่อมาจากอะไร?",
        choices: [
          "30-Minute Balance Order",
          "30-Minute Breakout",
          "30 Market Break Opportunity",
          "30 Moving Base Opening",
        ],
        correct: 1,
      },
      {
        q: "แนวคิดหลักของระบบ 30MBO คืออะไร?",
        choices: [
          "คาดเดาทิศทางตลาดล่วงหน้า",
          "รอให้ตลาดบอกทิศทางด้วยการเบรกกรอบ 30 นาทีแรก",
          "ใช้อินดิเคเตอร์หลายตัวร่วมกัน",
          "เข้าซื้อทันทีที่ตลาดเปิด",
        ],
        correct: 1,
      },
      {
        q: "กรอบราคาที่ใช้ในระบบ 30MBO เรียกว่าอะไร?",
        choices: ["Opening Range", "Breakout Zone", "Trading Box", "Daily Channel"],
        correct: 0,
      },
      {
        q: "หากราคาทะลุกรอบ 30 นาทีแรกขึ้นไป ระบบแนะนำให้ทำอย่างไร?",
        choices: ["รอเทรดสวนทาง", "เข้าซื้อ (BUY) ตามแรงตลาด", "ปิดโพซิชันทันที", "ใช้ EMA ยืนยันก่อน"],
        correct: 1,
      },
      {
        q: "Stop Loss ควรตั้งไว้ที่ตำแหน่งใด?",
        choices: ["ด้านเดียวกับกรอบที่เบรก", "กลางกรอบราคา", "ด้านตรงข้ามของกรอบ 30 นาทีแรก", "เหนือจุดเข้าซื้อ 1 Tick"],
        correct: 2,
      },
      {
        q: "“Tick Penetration” ในระบบ 30MBO หมายถึงอะไร?",
        choices: [
          "จำนวนแท่งเทียนที่ปิดในกรอบ",
          "จำนวน Tick ที่ราคาเบรกเกินกรอบเพื่อยืนยันสัญญาณ",
          "ความกว้างของกรอบราคา",
          "ระยะห่างของ Stop Loss",
        ],
        correct: 1,
      },
      {
        q: "ตลาดแบบใด “ไม่เหมาะ” กับการใช้ระบบ 30MBO?",
        choices: ["ตลาดที่มีแนวโน้มชัดเจน (Trending)", "ตลาดที่มีข่าวแรง", "ตลาดที่แกว่งในกรอบแคบ (Sideway)", "ตลาดที่มีปริมาณซื้อขายสูง"],
        correct: 2,
      },
      {
        q: "จุดเด่นของระบบ 30MBO คืออะไร?",
        choices: [
          "ใช้ Indicator หลายตัวช่วยกรองสัญญาณ",
          "เรียบง่าย วัดผลได้ และใช้วินัยกำหนดจังหวะเทรด",
          "เน้นการเทรดสวนเทรนด์ระยะสั้น",
          "เทรดได้ทุกช่วงเวลาโดยไม่ต้องรอข่าว",
        ],
        correct: 1,
      },
      {
        q: "“Trailing Stop” ในระบบนี้มีจุดประสงค์เพื่ออะไร?",
        choices: ["เพิ่มขนาดสัญญา", "ขยับ Stop Loss ตามราคาเพื่อล็อกกำไร", "ปิดโพซิชันอัตโนมัติเมื่อครบเวลา", "ลดต้นทุนค่าธรรมเนียม"],
        correct: 1,
      },
      {
        q: "องค์ประกอบสำคัญของความสำเร็จในระบบ 30MBO คืออะไร?",
        choices: ["ดวงและความกล้า", "ความเร็วในการกดคำสั่ง", "วินัย + ระบบ + การบริหารความเสี่ยง", "การเปิดหลายโพซิชันพร้อมกัน"],
        correct: 2,
      },
    ]);
  }

  // 3) Stochastic Pop - Pop แล้วไป! จังหวะไว กำไรแรง
  if (!questions && course.title.trim() === "Stochastic Pop - Pop แล้วไป! จังหวะไว กำไรแรง") {
    questions = build([
      {
        q: "แนวคิดหลักของระบบ Stochastic Pop คืออะไร?",
        choices: [
          "เทรดสวนเทรนด์ในช่วง Oversold",
          "เทรดตามเทรนด์ในช่วงพักฐาน",
          "เทรดตาม Momentum เมื่อเข้าเขต Overbought/Oversold",
          "เทรดเมื่อ RSI ตัดกับ MACD",
        ],
        correct: 2,
      },
      {
        q: "SP ใช้ค่าอะไรใน Stochastic ในการพิจารณาเข้าเทรด?",
        choices: ["ค่า RSI และ CCI", "ค่า Fast %K", "ค่า Slow %K", "ค่า MACD Histogram"],
        correct: 2,
      },
      {
        q: "Timeframe ที่แนะนำสำหรับการใช้งาน SP คืออะไร?",
        choices: ["1 นาที และ 3 นาที", "5 นาที และ 10 นาที", "15 นาที และ 30 นาที", "1 ชั่วโมง และ 4 ชั่วโมง"],
        correct: 1,
      },
      {
        q: "SP จะเข้าสถานะ Buy เมื่อเกิดเงื่อนไขใด?",
        choices: ["%K ปิดต่ำกว่า 25%", "%K ตัด %D ขึ้น", "%K ปิดสูงกว่า 75%", "%D ปรับขึ้นเร็วกว่า %K"],
        correct: 2,
      },
      {
        q: "การออกจากสถานะใน SP ทำเมื่อใด?",
        choices: ["เมื่อเกิด Bearish Engulfing", "เมื่อ %K และ %D ตัดกัน", "เมื่อราคาแตะ EMA 50", "เมื่อ MACD ให้สัญญาณกลับตัว"],
        correct: 1,
      },
      {
        q: "หากไม่มีสัญญาณออกใน SP ภายในวัน ควรทำอย่างไร?",
        choices: ["ถือข้ามคืน", "ปิดครึ่งหนึ่งของออเดอร์", "ปรับ Timeframe", "ปิดสถานะทั้งหมดก่อนสิ้นวัน"],
        correct: 3,
      },
      {
        q: "ข้อใด “ไม่ใช่” จุดเด่นของ SP?",
        choices: [
          "เข้าเทรดตามแรงส่งตลาด",
          "ใช้กับตลาดที่มีความผันผวน",
          "ทำกำไรในช่วงที่ตลาดนิ่ง",
          "เข้าตลาดเมื่อคนส่วนใหญ่ลังเล",
        ],
        correct: 2,
      },
      {
        q: "SP เชิงรุก (Aggressive SP) คืออะไร?",
        choices: [
          "การเข้าเพิ่มไม้ซ้ำทันที",
          "การถือสถานะต่อแม้เกิดสัญญาณออก",
          "การเข้าเทรดด้วย RSI",
          "การใช้ Moving Average คู่กับ SP",
        ],
        correct: 1,
      },
      {
        q: "คำว่า “Pop” ใน Stochastic Pop เปรียบกับอะไร?",
        choices: ["แรงขายที่มากเกิน", "การกลับตัวแรง", "การระเบิดของ Momentum เหมือนข้าวโพดคั่ว", "การตัดสินใจแบบสุ่ม"],
        correct: 2,
      },
      {
        q: "SP เหมาะกับนักเทรดประเภทใดมากที่สุด?",
        choices: ["นักลงทุนถือยาว", "นักเก็งกำไรระยะกลาง", "เทรดเดอร์รายวัน (Day Trader)", "นักเทรดตามข่าว"],
        correct: 2,
      },
    ]);
  }

  /** ถ้าคอร์สไม่ได้อยู่ 3 กลุ่มบน → ใช้ quiz จาก data หรือ fallback */
  if (!questions) {
    const transformed = transformFromCourse(course);
    questions =
      transformed ??
      ([
        {
          q: "หัวใจของการพัฒนาเว็บแบบ Full-Stack คืออะไร?",
          choices: ["รู้แค่ Frontend", "รู้แค่ Backend", "เข้าใจทั้งระบบตั้งแต่ UI จนถึงฐานข้อมูล"],
          answer: 2,
        },
        {
          q: "Git ใช้เพื่ออะไร?",
          choices: ["ตกแต่ง UI", "จัดการเวอร์ชันซอร์สโค้ด", "เรนเดอร์วิดีโอ"],
          answer: 1,
        },
      ] satisfies QuizQuestion[]);
  }

  // เกณฑ์ผ่าน 60% (ปัดขึ้น)
  const passScore = Math.ceil(questions.length * 0.6);

  return (
    <>
      <Navbar />
      <main className="container-narrow pt-28 pb-16">
        <QuizClient
          slug={slug}
          courseTitle={course.title}
          questions={questions}
          passScore={passScore}
        />
      </main>
    </>
  );
}
