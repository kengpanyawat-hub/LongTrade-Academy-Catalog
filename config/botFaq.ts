// config/botFaq.ts
export type BotRule = {
  intent: string;
  // คำ/วลี/คำถามที่คาดว่าจะพิมพ์ (รองรับภาษาไทย & อังกฤษ)
  patterns: RegExp[];
  // ข้อความตอบกลับ (คืนเป็น string)
  reply: () => string;
};

// ปุ่มลัดแนะนำให้ผู้ใช้กดถามไว ๆ
export const QUICK_REPLIES: string[] = [
  "ราคา",
  "สั่งซื้อ",
  "ติดตั้งยังไง",
  "รีวิว",
  "โปรโมชั่น",
  "ติดต่อคนจริง",
];

// คลัง QA หลัก (แก้/เพิ่มได้ตามต้องการ)
export const BOT_RULES: BotRule[] = [
  {
    intent: "price",
    patterns: [/ราคา/i, /คอร์ส.*เท่าไร/i, /เท่าไหร่/i, /how much/i],
    reply: () =>
      [
        "✨ **ราคา & แพ็กเกจ**",
        "• Goldflow Indicator เริ่มต้น **โปรแนะนำ** (สอบถามราคาอัปเดตล่าสุดกับทีมงาน)",
        "• EA / คอร์สเรียน / Ebook มีหลายแพ็กเกจ",
        "",
        "ดูทั้งหมดที่หน้าเว็บ หรือคุยกับทีมงานทาง LINE ได้เลย:",
        "https://line.me/ti/p/~longtrade",
      ].join("\n"),
  },
  {
    intent: "buy",
    patterns: [/สั่งซื้อ/i, /ซื้อ/i, /จ่ายเงิน/i, /payment/i, /order/i],
    reply: () =>
      [
        "🛒 **วิธีสั่งซื้อ**",
        "1) แอด LINE: https://line.me/ti/p/~longtrade",
        "2) แจ้งสินค้าที่ต้องการ / แพ็กเกจ",
        "3) ทีมงานจะแจ้งขั้นตอนชำระเงินและการเปิดใช้งานให้ครบครับ/ค่ะ",
      ].join("\n"),
  },
  {
    intent: "install",
    patterns: [/ติดตั้ง/i, /ใช้งานยังไง/i, /setup/i, /install/i, /เริ่มต้น/i],
    reply: () =>
      [
        "⚙️ **วิธีติดตั้ง/เริ่มต้นใช้งาน**",
        "• รองรับบน TradingView (อินดิเคเตอร์)",
        "• หลังสั่งซื้อ ทีมงานจะเพิ่มสิทธิ์ให้บัญชี TradingView ของคุณ",
        "• มีวิดีโอสอนใช้งาน + คู่มือ",
        "",
        "สอบถาม/นัดติดตั้งกับทีมงาน: https://line.me/ti/p/~longtrade",
      ].join("\n"),
  },
  {
    intent: "review",
    patterns: [/รีวิว/i, /feedback/i, /testimonials?/i, /ผู้ใช้จริง/i],
    reply: () =>
      [
        "🗣️ **รีวิวจากผู้ใช้จริง**",
        "• เรารวบรวมรีวิวไว้หน้า Goldflow + หน้าผลิตภัณฑ์ต่าง ๆ",
        "• ดูเดโมวิดีโอได้ในหน้าแรกของเว็บ",
        "",
        "เปิดดูเดโมที่นี่: https://www.longtradeacademy.com",
      ].join("\n"),
  },
  {
    intent: "promo",
    patterns: [/โปร/i, /ส่วนลด/i, /promotion/i, /discount/i],
    reply: () =>
      [
        "🎁 **โปรโมชั่น/ส่วนลด**",
        "• มีโปรอัปเดตเป็นช่วง ๆ",
        "• แนะนำให้ทัก LINE เพื่อรับโปรล่าสุด:",
        "https://line.me/ti/p/~longtrade",
      ].join("\n"),
  },
  {
    intent: "goldflow",
    patterns: [/goldflow/i, /โกลด์โฟลว์/i, /ระบบทอง/i],
    reply: () =>
      [
        "📊 **GOLDFLOW SYSTEM**",
        "• กลยุทธ์ MA Crossover + สัญญาณยืนยัน",
        "• มี TP/SL/Entry ชัดเจน ใช้งานง่ายบนชาร์ต",
        "• เหมาะกับ Trend-Follow & Swing",
        "",
        "ดูรายละเอียด + วิดีโอเดโม: /indicators/goldflow",
      ].join("\n"),
  },
  {
    intent: "contact-human",
    patterns: [/คนจริง/i, /แอดมิน/i, /ติดต่อ/i, /support/i, /help/i],
    reply: () =>
      [
        "👩‍💼 **ติดต่อทีมงาน**",
        "ทัก LINE ได้เลยครับ/ค่ะ: https://line.me/ti/p/~longtrade",
        "เราตอบไวในเวลาทำการ และมีทีมงานช่วยติดตั้ง/สอนใช้งาน",
      ].join("\n"),
  },
  {
    intent: "default",
    patterns: [/.*/],
    reply: () =>
      [
        "ขอบคุณที่ติดต่อครับ/ค่ะ — ทีมงานจะตอบกลับโดยเร็ว",
        "",
        "ลิงก์ที่อาจเป็นประโยชน์:",
        "• LINE: https://line.me/ti/p/~longtrade",
        "• Website: https://www.longtradeacademy.com",
      ].join("\n"),
  },
];

// ฟังก์ชันจับคู่ข้อความกับกติกา (simple scoring: เจอ rule แรกที่แมตช์ก็ใช้เลย)
export function getBotReply(input: string): string {
  const text = (input || "").toLowerCase();
  for (const rule of BOT_RULES) {
    if (rule.patterns.some((re) => re.test(text))) {
      return rule.reply();
    }
  }
  // สำรอง (ไม่ควรถึง)
  return BOT_RULES[BOT_RULES.length - 1].reply();
}
