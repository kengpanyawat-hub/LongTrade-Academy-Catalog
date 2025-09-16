// data/types.ts
export type PopupBody = { heading: string; text: string };

// เพิ่มโครงสร้างใหม่ (แสดงเป็นกรอบลิสต์ในโมดัล)
export type PopupSection = { title: string; items: string[] };

export type CatalogItem = {
  title: string;
  summary: string;
  cover: string;
  website?: string;
  facebook?: string;
  samples?: string[];
  tags?: string[]; // (ถ้ามีจะโชว์เป็นชิป)
  popup: {
    intro?: string;
    body?: PopupBody[];      // ของเดิมยังใช้ได้ (fallback อัตโนมัติ)
    sections?: PopupSection[]; // ของใหม่ที่เราจะใช้ทำลิสต์
    metrics?: string[];        // (ออปชัน) สรุปท้าย ๆ แบบในรูปตัวอย่าง
  };
};
