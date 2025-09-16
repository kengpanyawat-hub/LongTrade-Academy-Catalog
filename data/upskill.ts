// data/upskill.ts
export type UpskillBlock = {
  title: string;
  text: string;
  bullets: string[];
  image: string;     // เปลี่ยนเป็นรูปจริงภายหลังได้
};

export const upskill: UpskillBlock[] = [
  {
    title: "พื้นฐานแน่น",
    text: "เข้าใจโครงสร้างตลาด การจัดการความเสี่ยง และวินัยการเทรด",
    bullets: ["Market Structure", "Risk/Reward", "Trading Plan"],
    image: "https://picsum.photos/seed/upskill1/900/600"
  },
  {
    title: "กลยุทธ์ทำกำไร",
    text: "นำเครื่องมือและอินดิเคเตอร์มาผสานกับ Price Action",
    bullets: ["Trend/Range Playbook", "Confluence Signals", "Backtest Mindset"],
    image: "https://picsum.photos/seed/upskill2/900/600"
  },
  {
    title: "ลงมือจริงอย่างมั่นใจ",
    text: "จากแผนสู่การปฏิบัติ พร้อมเช็กไทม์ไลน์และรีวิวผลลัพธ์",
    bullets: ["Checklist ก่อนเข้าเทรด", "Post-trade Review", "Continuous Improvement"],
    image: "https://picsum.photos/seed/upskill3/900/600"
  }
];
