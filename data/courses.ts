// data/courses.ts
// ❗️ไม่ต้อง import VideoPlayer ที่นี่ เพราะเป็นไฟล์ข้อมูลล้วน

/* ----------------------------- Types ----------------------------- */
export type Lesson = {
  id: string;
  title: string;
  duration: string;
  /** อนุญาตให้กรอกได้ทั้ง "รหัส" หรือ "ลิงก์เต็ม" ของ YouTube */
  videoId?: string;
  /** ค่าที่ถูกสกัดเป็นรหัส YouTube แล้ว (ให้หน้า player ใช้) */
  youtubeId?: string;
};

export type Section = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type QuizChoice = { id: string; label: string };
export type QuizQuestion = {
  id: string;
  title: string;
  /** เพื่อรองรับโค้ดเดิมที่อ้าง question.q.label ได้ */
  q?: string | { label: string };
  choices: QuizChoice[];
  /** id ของช้อยส์ที่ถูก */
  answerId: string;
};

export type CourseQuiz = {
  /** เปอร์เซ็นต์ผ่าน เช่น 70 = ต้องถูก >=70% */
  passingScore: number;
  questions: QuizQuestion[];
};

export type Instructor = {
  name: string;
  role: string;
  /** รูปโปรไฟล์ (เช่น /instructors/tiw.jpg ใน public/) */
  avatar?: string;
};

export type Course = {
  slug: string;
  title: string;
  cover: string;
  hours: string;
  price: number;
  originalPrice?: number;
  intro: string;
  instructor: Instructor;
  sections: Section[];
  /** รหัสปลดล็อครายคอร์ส */
  unlockCode: string;
  /** ชุดข้อสอบรายคอร์ส */
  quiz: CourseQuiz;
};

/* ---------------------- YouTube helpers ---------------------- */
/** รับได้ทั้งรหัสดิบ, youtu.be/, youtube.com/watch?v=, /shorts/... */
function extractYoutubeId(input?: string): string | undefined {
  if (!input) return undefined;

  const s = input.trim();

  // กรณีเป็นรหัสดิบ (11 ตัวอักษรปกติของ YouTube ID) หรือมีขีดกลาง
  // ยอมรับความยาว 8-15 ตัว เพื่อเผื่อบางคลิปสั้น/ยาวต่างไป
  const bareId = /^[A-Za-z0-9_-]{8,15}$/.test(s);
  if (bareId) return s;

  try {
    const url = new URL(s);
    // youtu.be/<id>
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "").split("/")[0];
      return id || undefined;
    }
    // youtube.com/watch?v=<id>
    const v = url.searchParams.get("v");
    if (v) return v;

    // youtube.com/shorts/<id>
    if (url.pathname.includes("/shorts/")) {
      const id = url.pathname.split("/shorts/")[1]?.split("/")[0];
      return id || undefined;
    }

    // youtube.com/embed/<id>
    if (url.pathname.includes("/embed/")) {
      const id = url.pathname.split("/embed/")[1]?.split("/")[0];
      return id || undefined;
    }
  } catch {
    // ไม่ใช่ URL => ไม่ทำอะไร
  }

  // ไม่พบ id ที่ชัดเจน
  return undefined;
}

/** สร้าง lesson ที่เติม youtubeId ให้อัตโนมัติจาก videoId */
function L(partial: Omit<Lesson, "youtubeId">): Lesson {
  return { ...partial, youtubeId: extractYoutubeId(partial.videoId) };
}

/* -------------------------------------------------- */
/* 6 คอร์สตัวอย่าง (ปรับชื่อ/รูป/บทเรียนได้ตามต้องการ) */
/* -------------------------------------------------- */
export const courses: ReadonlyArray<Course> = [
  {
    slug: "One-day-Gold-Trading",
    title: "One day Gold Trading - คอร์สเร่งรัดเทรดทองเป็นใน 1 วัน",
    cover: "/courses/courses1.jpg",
    hours: "2 ชั่วโมง 40 นาที",
    price: 1990,
    originalPrice: 3990,
    intro: "One day Gold Trading - คอร์สเร่งรัดเทรดทองเป็นใน 1 วัน",
    instructor: { name: "โค้ชทิว", role: "Coach", avatar: "/instructors/tiw.jpg" },
    sections: [
      {
        id: "sec1",
        title: "1.เทรดทองคืออะไร?",
        lessons: [
          L({ id: "l1", title: "เทรดทองคืออะไร?", duration: "9.45 นาที", videoId: "https://youtu.be/2i4PHWK-JO4" }),
        ],
      },
      {
        id: "sec2",
        title: "2.มือใหม่เริ่มเทรดทองต้องใช้อะไรบ้าง?",
        lessons: [
          L({ id: "l2", title: "มือใหม่เริ่มเทรดทองต้องใช้อะไรบ้าง?", duration: "10.58 นาที", videoId: "https://youtu.be/G7nrxtzWSCo" }),
        ],
      },
      {
        id: "sec3",
        title: "3.เทรดทองคืออะไร?",
        lessons: [
          L({ id: "l3", title: "ทุนเริ่มต้นเทรดทอง ใช้เงินกี่บาท?", duration: "24.12 นาที", videoId: "https://youtu.be/gLRxBc7lr-4" }),
        ],
      },
      {
        id: "sec4",
        title: "4.การเชื่อมต่อบัญชี และใช้งานโปรแกรมที่จำเป็น",
        lessons: [
          L({ id: "l4", title: "การเชื่อมต่อบัญชี และใช้งานโปรแกรมที่จำเป็น", duration: "22.00 นาที", videoId: "https://youtu.be/6OMhgW03w2c" }),
        ],
      },
      {
        id: "sec5",
        title: "5.คำศัพท์เบื้องต้นที่ต้องรู้",
        lessons: [L({ id: "l5", title: "คำศัพท์เบื้องต้นที่ต้องรู้", duration: "30.42 นาที", videoId: "https://youtu.be/mLMCQQ-rA3w?si=sGvw3Ojh3K0OdEQ3" })],
      },
      {
        id: "sec6",
        title: "6.เทรดทองกำไรยังไง ขาดทุนยังไง?",
        lessons: [L({ id: "l6", title: "เทรดทองกำไรยังไง ขาดทุนยังไง?", duration: "16.35 นาที", videoId: "https://youtu.be/b8qkcWodvlI" })],
      },
      {
        id: "sec7",
        title: "7.เข้าสู่สนามจริง ( แบบมือใหม่ )",
        lessons: [L({ id: "l7", title: "เข้าสู่สนามจริง ( แบบมือใหม่ )", duration: "6.25 นาที", videoId: "https://youtu.be/PUJ9rBCIvAU" })],
      },
      {
        id: "sec8",
        title: "8.การวิเคราะห์กราฟและสร้าง Trading Plan",
        lessons: [L({ id: "l8", title: "การวิเคราะห์กราฟและสร้าง Trading Plan", duration: "28.47 นาที", videoId: "https://youtu.be/RJ12ZPBwCDM" })],
      },
      {
        id: "sec9",
        title: "9.Mindset ที่จำเป็นในการเทรด",
        lessons: [L({ id: "l9", title: "Mindset ที่จำเป็นในการเทรด", duration: "11.20 นาที", videoId: "https://youtu.be/7qR_rf7EpFI" })],
      },
    ],
    unlockCode: "LT-98989",
    quiz: {
      passingScore: 70,
      questions: [
        {
          id: "q1",
          title: "Git ใช้ทำอะไรหลักๆ?",
          q: { label: "Git ใช้ทำอะไรหลักๆ?" },
          choices: [
            { id: "a", label: "จัดการ Dependencies" },
            { id: "b", label: "จัดการเวอร์ชันโค้ด" },
            { id: "c", label: "รันเซิร์ฟเวอร์" },
            { id: "d", label: "บีบอัดภาพ" },
          ],
          answerId: "b",
        },
        {
          id: "q2",
          title: "คำสั่ง `useState` อยู่ในไลบรารีใด?",
          q: { label: "คำสั่ง `useState` อยู่ในไลบรารีใด?" },
          choices: [
            { id: "a", label: "React" },
            { id: "b", label: "Next.js" },
            { id: "c", label: "Node.js" },
            { id: "d", label: "Vite" },
          ],
          answerId: "a",
        },
        {
          id: "q3",
          title: "CSS Flexbox ใช้แก้ปัญหาแนวใดเป็นหลัก?",
          q: { label: "CSS Flexbox ใช้แก้ปัญหาแนวใดเป็นหลัก?" },
          choices: [
            { id: "a", label: "การจัดวาง Layout และจัดเรียงองค์ประกอบ" },
            { id: "b", label: "จัดการ Request" },
            { id: "c", label: "ทำแอนิเมชัน 3D" },
            { id: "d", label: "การทำ Routing" },
          ],
          answerId: "a",
        },
      ],
    },
  },

  {
    slug: "Technic-30MBO",
    title: "เทคนิคการเทรดท่า 30MBO - เรียบง่ายแต่ทรงพลัง",
    cover: "/courses/courses3.jpg",
    hours: "2 ชั่วโมง 40 นาที",
    price: 2990,
    originalPrice: 5990,
    intro: "เทคนิคการเทรดท่า 30MBO - เรียบง่ายแต่ทรงพลัง",
    instructor: { name: "โค้ชทิว", role: "Coach", avatar: "/instructors/tiw.jpg" },
    sections: [
      { id: "p-sec1", title: "1.30MBO คืออะไร", lessons: [L({ id: "p1", title: "30MBO คืออะไร", duration: "10 นาที", videoId: "https://youtu.be/7Z2QutlUvgo" })] },
      { id: "p-sec2", title: "2.ขั้นตอนการใช้ท่าเทรดนี้", lessons: [L({ id: "p2", title: "ขั้นตอนการใช้ท่าเทรดนี้", duration: "30 นาที", videoId: "https://youtu.be/Ed4mRf3tI8o" })] },
      { id: "p-sec3", title: "3.ตัวอย่างการเข้าเทรดด้วยท่า 30MBO", lessons: [L({ id: "p3", title: "ตัวอย่างการเข้าเทรดด้วยท่า 30MBO", duration: "10 นาที", videoId: "https://youtu.be/9gvpG5_kA6U" })] },
      { id: "p-sec4", title: "4.เงื่อนไขสำคัญ", lessons: [L({ id: "p4", title: "เงื่อนไขสำคัญ", duration: "10 นาที", videoId: "https://youtu.be/hkss4Eu-TVA" })] },
      { id: "p-sec5", title: "5.การตั้ง Stop loss และ Trailing stop Loss", lessons: [L({ id: "p5", title: "การตั้ง Stop loss และ Trailing stop Loss", duration: "10 นาที", videoId: "https://youtu.be/PWBhmf7-UJ8" })] },
      { id: "p-sec6", title: "6.สิ่งที่ควรรู้ในการใช้ท่าเทรดนี้", lessons: [L({ id: "p6", title: "สิ่งที่ควรรู้ในการใช้ท่าเทรดนี้", duration: "30 นาที", videoId: "https://youtu.be/srttoh_kT38" })] },
      { id: "p-sec7", title: "7.ตลาดที่เหมาะสมกับท่าเทรดนี้", lessons: [L({ id: "p7", title: "ตลาดที่เหมาะสมกับท่าเทรดนี", duration: "10 นาที", videoId: "https://youtu.be/ObySniX37n0" })] },
      { id: "p-sec8", title: "8.Case study ท่าเทรด 30MBO", lessons: [L({ id: "p8", title: "Case study ท่าเทรด 30MBO", duration: "10 นาที", videoId: "https://youtu.be/hTmIBf4dGEc" })] },
    ],
    unlockCode: "LT-46466",
    quiz: {
      passingScore: 70,
      questions: [
        {
          id: "py1",
          title: "Pandas ใช้โครงสร้างข้อมูลหลักชื่อว่าอะไร?",
          q: { label: "Pandas ใช้โครงสร้างข้อมูลหลักชื่อว่าอะไร?" },
          choices: [
            { id: "a", label: "Series / DataFrame" },
            { id: "b", label: "Tensor" },
            { id: "c", label: "RDB Table" },
            { id: "d", label: "Queue" },
          ],
          answerId: "a",
        },
        {
          id: "py2",
          title: "NumPy array โดดเด่นเรื่องใด?",
          q: { label: "NumPy array โดดเด่นเรื่องใด?" },
          choices: [
            { id: "a", label: "การเรนเดอร์กราฟ 3D" },
            { id: "b", label: "การคำนวณเชิงเวกเตอร์ประสิทธิภาพสูง" },
            { id: "c", label: "ทำเว็บเซิร์ฟเวอร์" },
            { id: "d", label: "จัดการสตรีมวิดีโอ" },
          ],
          answerId: "b",
        },
      ],
    },
  },

  {
    slug: "Stochastic-Pop-Pop",
    title: "Stochastic Pop - Pop แล้วไป! จังหวะไว กำไรแรง",
    cover: "/courses/courses2.jpg",
    hours: "2 ชั่วโมง 10 นาที",
    price: 2990,
	originalPrice: 5990,
    intro: "Stochastic Pop - Pop แล้วไป! จังหวะไว กำไรแรง",
    instructor: { name: "โค้ชทิว", role: "Coach", avatar: "/instructors/tiw.jpg" },
    sections: [
      { id: "dm1", title: "Stochastic Pop คือ อะไร", lessons: [L({ id: "dm1-1", title: "Stochastic Pop คือ อะไร", duration: "15 นาที", videoId: "https://youtu.be/OoHiYiSwft0?si=ENKk1e5bZIxguOV_" })] },
      { id: "dm2", title: "แนวคิดพื้นฐาน Stochastic Oscillator", lessons: [L({ id: "dm1-2", title: "แนวคิดพื้นฐาน Stochastic Oscillator", duration: "15 นาที", videoId: "https://youtu.be/lVgxXtZUxDY" })] },
      { id: "dm3", title: "แนวคิด Stochastic Pop (SP)", lessons: [L({ id: "dm1-3", title: "แนวคิด Stochastic Pop (SP)", duration: "15 นาที", videoId: "https://youtu.be/nNhY2pRIAV0" })] },
      { id: "dm4", title: "การเข้าเทรดด้วยท่า Stochastic Pop (SP)", lessons: [L({ id: "dm1-4", title: "การเข้าเทรดด้วยท่า Stochastic Pop (SP)", duration: "15 นาที", videoId: "https://youtu.be/UzfOdLmcI-4" })] },
      { id: "dm5", title: "สิ่งที่ควรรู้ในการใช้ท่าเทรดนี้", lessons: [L({ id: "dm1-5", title: "สิ่งที่ควรรู้ในการใช้ท่าเทรดนี้", duration: "15 นาที", videoId: "https://youtu.be/0Cfzbo5K2h8" })] },
      { id: "dm6", title: "กลยุทธ์ที่แนะนำเพิ่มเติม", lessons: [L({ id: "dm1-6", title: "กลยุทธ์ที่แนะนำเพิ่มเติม", duration: "15 นาที", videoId: "dQw4w9WgXcQ" })] },
      { id: "dm7", title: "ตลาดที่เหมาะสมสำหรับการเทรดท่า SP", lessons: [L({ id: "dm1-7", title: "ตลาดที่เหมาะสมสำหรับการเทรดท่า SP", duration: "15 นาที", videoId: "https://youtu.be/KHiKrag2TmI" })] },
    ],
    unlockCode: "LT-19655",
    quiz: {
      passingScore: 70,
      questions: [
        {
          id: "dmq1",
          title: "KPI ในดิจิทัลมาร์เก็ตติ้งควร…",
          q: { label: "KPI ในดิจิทัลมาร์เก็ตติ้งควร…" },
          choices: [
            { id: "a", label: "ชัดเจน/วัดได้/มีกรอบเวลา" },
            { id: "b", label: "กำหนดกว้างๆ" },
            { id: "c", label: "ไม่ต้องอิงเป้าธุรกิจ" },
            { id: "d", label: "วัดไม่ได้ก็ได้" },
          ],
          answerId: "a",
        },
      ],
    },
  },

  {
    slug: "MACS",
    title: "กลยุทธ์ MACS – “สร้างแผนเทรดให้ชนะตลาด",
    cover: "/courses/courses4.jpg",
    hours: "2 ชั่วโมง 30 นาที",
    price: 3990,
	originalPrice: 4900,
    intro: "ออกแบบประสบการณ์ผู้ใช้และส่วนติดต่อที่ใช้งานง่าย",
    instructor: { name: "โค้ชทิว", role: "Coach", avatar: "/instructors/tiw.jpg" },
    sections: [
      { id: "MA1", title: "1.MACS คืออะไร", lessons: [L({ id: "p1", title: "MACS คืออะไร", duration: "10 นาที", videoId: "https://youtu.be/7Z2QutlUvgo" })] },
      { id: "MA2", title: "2.ขึ้นตอนการใช้ท่าเทรดนี้", lessons: [L({ id: "p2", title: "ขึ้นตอนการใช้ท่าเทรดนี้", duration: "30 นาที", videoId: "https://youtu.be/Ed4mRf3tI8o" })] },
      { id: "MA3", title: "3.ตัวอย่างกราเข้าเทรดด้วยท่า MACS", lessons: [L({ id: "p3", title: "ตัวอย่างกราเข้าเทรดด้วยท่า MACS", duration: "10 นาที", videoId: "https://youtu.be/9gvpG5_kA6U" })] },
      { id: "MA4", title: "4.เงื่อนไขสำคัญ", lessons: [L({ id: "p4", title: "เงื่อนไขสำคัญ", duration: "10 นาที", videoId: "https://youtu.be/hkss4Eu-TVA" })] },
      { id: "MA5", title: "5.การตั้ง Stop loss และ Trailing stop Loss", lessons: [L({ id: "p5", title: "การตั้ง Stop loss และ Trailing stop Loss", duration: "10 นาที", videoId: "https://youtu.be/PWBhmf7-UJ8" })] },
      { id: "MA6", title: "6.กลยุทธ์ที่แนะนำเพิ่มเติม", lessons: [L({ id: "p6", title: "กลยุทธ์ที่แนะนำเพิ่มเติม", duration: "30 นาที", videoId: "https://youtu.be/srttoh_kT38" })] },
      { id: "MA7", title: "7.สิ่งที่ควรรู้ในการใช้ท่าเทรดนี้", lessons: [L({ id: "p7", title: "สิ่งที่ควรรู้ในการใช้ท่าเทรดนี้", duration: "10 นาที", videoId: "https://youtu.be/ObySniX37n0" })] },
      { id: "MA8", title: "8.Case study ท่าเทรด MACS", lessons: [L({ id: "p8", title: "Case study ท่าเทรด MACS", duration: "10 นาที", videoId: "https://youtu.be/hTmIBf4dGEc" })] },
    ],
    unlockCode: "LT-88887",
    quiz: {
      passingScore: 70,
      questions: [
        {
          id: "uxq1",
          title: "Primary action ควร…",
          q: { label: "Primary action ควร…" },
          choices: [
            { id: "a", label: "วางเด่น/สม่ำเสมอ" },
            { id: "b", label: "สีเทาอ่อน" },
            { id: "c", label: "ซ่อนในเมนู" },
            { id: "d", label: "ตัวหนังสือเล็ก" },
          ],
          answerId: "a",
        },
      ],
    },
  },

  {
    slug: "FIBONACCI-MASTERCLASS",
    title: "FIBONACCI MASTERCLASS – ถอดรหัสจังหวะตลาดด้วยตัวเลขทองคำ",
    cover: "/courses/courses5.jpg",
    hours: "2 ชั่วโมง 20 นาที",
    price: 3990,
	originalPrice: 4900,
    intro: "หลักการลงทุนหุ้น วิเคราะห์ปัจจัยพื้นฐานและกราฟเทคนิค",
    instructor: { name: "โค้ชทิว", role: "Coach", avatar: "/instructors/tiw.jpg" },
    sections: [
      { id: "MA1", title: "1.แนะนำเรื่องฟีโบนัชชี", lessons: [L({ id: "p1", title: "แนะนำเรื่องฟีโบนัชชี", duration: "10 นาที", videoId: "https://youtu.be/7Z2QutlUvgo" })] },
      { id: "MA2", title: "2.ความจำเป็นในการเข้าใจและระบุแนวโน้มให้ถูกต้อง", lessons: [L({ id: "p2", title: "ความจำเป็นในการเข้าใจและระบุแนวโน้มให้ถูกต้อง", duration: "30 นาที", videoId: "https://youtu.be/Ed4mRf3tI8o" })] },
      { id: "MA3", title: "3.ระดับการย่อตัวของฟีโบนัชชี", lessons: [L({ id: "p3", title: "ระดับการย่อตัวของฟีโบนัชชี", duration: "10 นาที", videoId: "https://youtu.be/9gvpG5_kA6U" })] },
      { id: "MA4", title: "4.ระดับการคาดการณ์ของฟีโบนัชชี", lessons: [L({ id: "p4", title: "ระดับการคาดการณ์ของฟีโบนัชชี", duration: "10 นาที", videoId: "https://youtu.be/hkss4Eu-TVA" })] },
      { id: "MA5", title: "5.พลังของการบรรจบกันของฟีโบนัชชี", lessons: [L({ id: "p5", title: "พลังของการบรรจบกันของฟีโบนัชชี", duration: "10 นาที", videoId: "https://youtu.be/PWBhmf7-UJ8" })] },
      { id: "MA6", title: "6.ช่วงเวลาที่เหมาะสมในการเปิดสถานะ", lessons: [L({ id: "p6", title: "ช่วงเวลาที่เหมาะสมในการเปิดสถานะ", duration: "30 นาที", videoId: "https://youtu.be/srttoh_kT38" })] },
      { id: "MA7", title: "7.วิธีการเพิ่มประสิทธิภาพของจุดเข้าเทรด", lessons: [L({ id: "p7", title: "วิธีการเพิ่มประสิทธิภาพของจุดเข้าเทรด", duration: "10 นาที", videoId: "https://youtu.be/ObySniX37n0" })] },
      { id: "MA8", title: "8.ศิลปะของการออกจากการเทรด", lessons: [L({ id: "p8", title: "ศิลปะของการออกจากการเทรด", duration: "10 นาที", videoId: "https://youtu.be/hTmIBf4dGEc" })] },
      { id: "MA9", title: "9.การผสานกันอย่างยอดเยี่ยมระหว่างฟีโบนัชชีและคลื่นเอลเลียต", lessons: [L({ id: "p9", title: "การผสานกันอย่างยอดเยี่ยมระหว่างฟีโบนัชชีและคลื่นเอลเลียต", duration: "10 นาที", videoId: "https://youtu.be/PWBhmf7-UJ8" })] },
      { id: "MA10", title: "10.เคล็ดลับของการบริหารการเทรดที่ดีขึ้น", lessons: [L({ id: "p10", title: "เคล็ดลับของการบริหารการเทรดที่ดีขึ้น", duration: "30 นาที", videoId: "https://youtu.be/srttoh_kT38" })] },
      { id: "MA11", title: "11.ความผิดพลาดใหญ่ที่อาจทำให้คุณเสียเงินมากมาย", lessons: [L({ id: "p11", title: "ความผิดพลาดใหญ่ที่อาจทำให้คุณเสียเงินมากมาย", duration: "10 นาที", videoId: "https://youtu.be/ObySniX37n0" })] },
      { id: "MA12", title: "12.เครื่องมือฟีโบนัชชีที่ทรงพลังในการเทรดจริง", lessons: [L({ id: "p12", title: "เครื่องมือฟีโบนัชชีที่ทรงพลังในการเทรดจริง", duration: "10 นาที", videoId: "https://youtu.be/hTmIBf4dGEc" })] },
    ],
    unlockCode: "LT-64646",
    quiz: {
      passingScore: 70,
      questions: [
        {
          id: "stq1",
          title: "Stop loss มีไว้เพื่อ…",
          q: { label: "Stop loss มีไว้เพื่อ…" },
          choices: [
            { id: "a", label: "จำกัดความเสี่ยง" },
            { id: "b", label: "เพิ่มความเสี่ยง" },
            { id: "c", label: "ทำให้ออเดอร์ช้าลง" },
            { id: "d", label: "ดูกราฟสวยขึ้น" },
          ],
          answerId: "a",
        },
      ],
    },
  },

  {
    slug: "76Graph",
    title: "ถอดรหัสแท่งเทียน 76 รูปแบบ – ทุกแท่งคือร่องรอยของเงิน… อยู่ที่คุณจะมองเห็นหรือไม่",
    cover: "/courses/courses6.jpg",
    hours: "1 ชั่วโมง 50 นาที",
    price: 3990,
	originalPrice: 4900,
    intro: "พื้นฐานคริปโต โทเค็น และการจัดการความเสี่ยง",
    instructor: { name: "โค้ชทิว", role: "Coach", avatar: "/instructors/tiw.jpg" },
    sections: [
      {
        id: "cb1",
        title: "Section 1 : ปูพื้นฐานสู่โลกของแท่งเทียน (Introduction)",
        lessons: [
          L({ id: "cb1-1", title: "แนะนำบทเรียน (Introduction)", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
        ],
      },
      {
        id: "cb2",
        title: "Section 2 : สัญญาณต่อเนื่องขาขึ้น (Bullish Trend Continuation Patterns)",
        lessons: [
          L({ id: "cb2-1", title: "แก้ปัญหาการเทรดที่คุณกำลังเจอ (Get Solutions To Your Trading Problems)", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb2-2", title: "แนะนำบทเรียน (Introduction)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb2-3", title: "Bullish Separating Lines – แท่งแยกแนวขาขึ้น", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb2-4", title: "Gapping Up Doji – โดจิช่องว่างขาขึ้น", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb2-5", title: "Bullish Side By Side – แท่งขาขึ้นเคียงข้างกัน", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb2-6", title: "Rising Window – ช่องว่างขาขึ้น (Rising Window)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb2-7", title: "Upside Gap Three Method – เทคนิคช่องว่างขาขึ้นสามแท่ง", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb2-8", title: "Upside Tasuki Gap – ช่องว่าง Tasuki ขาขึ้น", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb2-9", title: "สรุปเนื้อหา (Summary)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
        ],
      },
      {
        id: "cb3",
        title: "Section 3 : สัญญาณกลับตัวขาขึ้น (Bullish Reversal Patterns)",
        lessons: [
          L({ id: "cb3-1", title: "แนะนำบทเรียน (Introduction)", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-2", title: "Bullish Abandoned Baby – เด็กถูกทิ้งขาขึ้น", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-3", title: "Bullish Belt Hold – เข็มขัดขาขึ้น", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-4", title: "Bullish Doji Star – ดาวโดจิขาขึ้น", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-5", title: "Bullish Engulfing – ครอบคลุมขาขึ้น", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-6", title: "Bullish Harami – ฮารามิขาขึ้น", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-7", title: "Bullish Harami Cross – ฮารามิครอสขาขึ้น", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-8", title: "Bullish Meeting Line – เส้นพบกันขาขึ้น", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-9", title: "Bullish Tasuki Line – เส้นทาสึกิขาขึ้น", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
		  L({ id: "cb3-10", title: "Bullish Tri-Star – ดาวสามดวงขาขึ้น", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-11", title: "Bullish Strong Line – แท่งแข็งแรงขาขึ้น", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-12", title: "Bullish Belt Hold – Concealing Baby Shallow – เด็กซ่อนตัว (ขาขึ้น)", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-13", title: "Hammer – ค้อนกลับตัวขาขึ้น", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-14", title: "Homing Pigeon – พิราบกลับรัง (ขาขึ้น)", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-15", title: "Inverted Hammer – ค้อนกลับหัวขาขึ้น", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-16", title: "Kicking Up – เตะขึ้น (สัญญาณกลับตัวแรง)", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-17", title: "Last Engulfing Bottom – ครอบคลุมสุดท้ายที่ก้น (กลับตัวขึ้น)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-18", title: "Matching Low – แท่งเทียนต่ำเท่ากัน (แนวรับกลับตัว)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
		  L({ id: "cb3-19", title: "Morning Doji Star – ดาวรุ่งโดจิ", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
		  L({ id: "cb3-20", title: "Morning Star Pattern – รูปแบบดาวรุ่ง (สัญญาณกลับตัวขึ้น)", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-21", title: "Piercing Pattern – แทงทะลุแนวลง (สัญญาณกลับตัวขึ้น)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-22", title: "Three Inside Up – สามแท่งด้านในขาขึ้น", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-23", title: "Three Outside Up – สามแท่งด้านนอกขาขึ้น", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-24", title: "Three Stars in The South – สามดาวทางใต้ (สัญญาณกลับตัวขึ้น)", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-25", title: "Three White Soldiers – ทหารขาวสามนาย (สัญญาณกลับตัวขึ้นที่แข็งแกร่ง)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-26", title: "Turn Up – พลิกกลับขึ้น", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-27", title: "Tweezer Bottom – แหนบคู่ก้น (แนวรับกลับตัวขึ้น)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb3-28", title: "Unique Three River Bottom – แม่น้ำสามสาย (ขาขึ้นเฉพาะตัว)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
		  L({ id: "cb3-29", title: "สรุปเนื้อหา (Summary)", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
        ],
      },
	  {
        id: "cb4",
        title: "Section 4 : สัญญาณต่อเนื่องขาลง (Bearish Trend Continuation Patterns)",
        lessons: [
          L({ id: "cb4-1", title: "แนะนำบทเรียน (Introduction)", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb4-2", title: "Bearish Separating Lines – แท่งแยกแนวขาลง", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb4-3", title: "Bearish Side By Side – แท่งขาลงเคียงข้างกัน", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb4-4", title: "Gapping Down Doji – โดจิช่องว่างขาลง", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb4-5", title: "Falling Window – ช่องว่างร่วงลง (แนวโน้มต่อเนื่องลง)", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb4-6", title: "Downside Gap Three Method – ช่องว่างขาลงสามแท่ง", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb4-7", title: "Bearish Three Line Strike – สามแท่งโจมตีขาลง", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb4-8", title: "In Neck Pattern – อินเน็ก (แนวโน้มต่อเนื่องขาลง)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb4-9", title: "On Neck Pattern – ออนเน็ก (แนวโน้มต่อเนื่องขาลง)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
		  L({ id: "cb4-9", title: "Thrusting Pattern – การแทงทะลุขาลง", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
		  L({ id: "cb4-9", title: "Two Bearish Gapping Candlesticks – สองแท่งเทียนช่องว่างขาลง", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
		  L({ id: "cb4-9", title: "สรุปเนื้อหา (Summary)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
        ],
      },
	  {
        id: "cb5",
        title: "Section 5 : สัญญาณกลับตัวขาลง (Bearish Reversal Patterns)",
        lessons: [
          L({ id: "cb5-1", title: "แนะนำบทเรียน (Introduction)", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-2", title: "Bearish Abandoned Baby – เด็กถูกทิ้งขาลง", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-3", title: "Bearish Belt Hold – เข็มขัดขาลง", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-4", title: "Collapsing Doji Star – ดาวโดจิถล่มแนวขึ้น", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-5", title: "Bearish Engulfing – ครอบคลุมขาลง", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-6", title: "Bearish Harami – ฮารามิขาลง", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-7", title: "Bearish Harami Cross – ฮารามิครอสขาลง", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-8", title: "Bearish Meeting Line – เส้นพบกันขาลง", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-9", title: "Bearish Tasuki Line – เส้นทาสึกิขาลง", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
		  L({ id: "cb5-10", title: "Bearish Tri-Star – ดาวสามดวงขาลง", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-11", title: "Bearish Strong Line – แท่งแข็งแรงขาลง", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-12", title: "Hanging Man – ชายแขวนคอ (สัญญาณกลับตัวขาลง)", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-13", title: "Kicking Down – เตะลง (กลับตัวแรง)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-14", title: "Last Engulfing Top – ครอบคลุมสุดท้ายบริเวณยอด", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-15", title: "Matching High – แท่งเทียนยอดเท่ากัน (แนวต้านกลับตัว)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-16", title: "Evening Doji Star – ดาวเย็นโดจิ (สัญญาณกลับตัวแรง)", duration: "20 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-17", title: "Evening Star – ดาวเย็น (กลับตัวจากขาขึ้นสู่ขาลง)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-18", title: "Three Inside Down – สามแท่งด้านในขาลง", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
		  L({ id: "cb5-19", title: "Three Outside Down – สามแท่งด้านนอกขาลง", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-20", title: "One Candle Shooting Star – ดาวตกแท่งเดียว (กลับตัวฉับพลัน)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
		  L({ id: "cb5-21", title: "Three Black Crows – อีกาดำสามตัว (สัญญาณกลับตัวแรงมาก)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-22", title: "Turn Down – พลิกลง", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
		  L({ id: "cb5-23", title: "Tweezers Top – แหนบคู่ยอด (แนวต้านกลับตัวลง)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-24", title: "Advance Block – บล็อกขาขึ้นชะลอตัว (สัญญาณเตือนกลับตัว)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
		  L({ id: "cb5-25", title: "Dark Cover Cloud – เมฆดำปกคลุม (สัญญาณกลับตัวสำคัญ)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-26", title: "Deliberation – รูปแบบลังเลก่อนกลับตัวลง", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
		  L({ id: "cb5-27", title: "Descending Hawk – เหยี่ยวร่วงลง (แนวโน้มกลับตัวขาลง)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-28", title: "Three Identical Crows – อีกาสามตัวเหมือนกัน (แรงขายชัดเจน)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
		  L({ id: "cb5-29", title: "Bearish Breakaway – เบรกอะเวย์ขาลง (แนวโน้มเปลี่ยนทิศ)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-30", title: "Northern Doji – โดจิภาคเหนือ (กลับตัวขาลง)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
		  L({ id: "cb5-31", title: "Two Crows – อีกาสองตัว (สัญญาณยืนยันขาลง)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-32", title: "Two Candle Shooting Star – ดาวตกสองแท่ง (แรงขายซ้ำ)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
		  L({ id: "cb5-33", title: "Upside Gaps Two Crows – ช่องว่างอีกาสองตัว (กลับตัวรุนแรง)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
          L({ id: "cb5-34", title: "สรุปเนื้อหา (Summary)", duration: "25 นาที", videoId: "dQw4w9WgXcQ" }),
        ],
      },
    ],
    unlockCode: "LT-25939",
    quiz: {
      passingScore: 70,
      questions: [
        {
          id: "cbq1",
          title: "Cold wallet โดดเด่นเรื่อง…",
          q: { label: "Cold wallet โดดเด่นเรื่อง…" },
          choices: [
            { id: "a", label: "ความปลอดภัยสูง" },
            { id: "b", label: "ใช้งานออนไลน์สะดวก" },
            { id: "c", label: "โอนเร็วที่สุด" },
            { id: "d", label: "จ่ายดอกเบี้ย" },
          ],
          answerId: "a",
        },
      ],
    },
  },
] as const;

/* helper */
export function findCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}
