// data/whyus.ts
export type WhyItem = {
  key: string;
  title: string;
  text: string;
  icon: "ShieldCheck" | "Timer" | "Sparkles" | "LineChart" | "Users" | "Undo2";
};

export const whyus: WhyItem[] = [
  { key: "accuracy",  title: "สัญญาณแม่นยำ", text: "อัลกอริทึมผ่านการทดสอบและปรับจูนอย่างต่อเนื่อง", icon: "LineChart" },
  { key: "fast",      title: "ใช้งานได้ทันที", text: "ติดตั้งง่าย เริ่มใช้งานภายในไม่กี่นาที",                 icon: "Timer" },
  { key: "curated",   title: "คัดสรรแล้ว",     text: "เนื้อหาและเครื่องมือที่ผ่านการใช้งานจริง",           icon: "ShieldCheck" },
  { key: "learn",     title: "เรียนรู้ครบ",     text: "Ebook, EA และคอร์สเรียนตั้งแต่พื้นฐานถึงระดับสูง",    icon: "Sparkles" },
  { key: "support",   title: "ซัพพอร์ตมืออาชีพ",text: "ทีมงานตอบไว พร้อมช่วยแก้ปัญหาและแนะนำการใช้งาน",    icon: "Users" },
  { key: "refund",    title: "ยืดหยุ่น",        text: "นโยบายการใช้งานชัดเจน ทดลองและอัปเกรดได้",           icon: "Undo2" }
];
