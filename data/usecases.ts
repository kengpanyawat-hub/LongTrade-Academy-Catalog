// data/usecases.ts
export type PlaybookStep = { title: string; bullets: string[] };
export type UseCase = {
  id: string;
  title: string;
  summary: string;
  category: "Trend" | "Breakout" | "Range" | "News";
  image: string;           // เปลี่ยนเป็นภาพจริงภายหลังได้
  tools: string[];         // เครื่องมือ/หมวดที่เกี่ยวข้อง (ตัวอย่างชื่อทั่วไป)
  steps: PlaybookStep[];   // ขั้นตอนปฏิบัติ
  metrics?: string[];      // ตัวชี้วัด/เงื่อนไขออก
  cta?: { text: string; url: string };
};

export const usecases: UseCase[] = [
  {
    id: "trend-follow",
    title: "ตามเทรนด์หลักด้วย MA+Volume",
    summary: "หาจังหวะตามเทรนด์ด้วยเส้นค่าเฉลี่ยและปริมาณซื้อขาย",
    category: "Trend",
    image: "https://picsum.photos/seed/usecase1/1200/675",
    tools: ["Indicator: Trend", "Volume Analysis", "Ebook: Trend Playbook"],
    steps: [
      {
        title: "เตรียมกราฟ",
        bullets: [
          "ตั้ง Timeframe: 1H/4H",
          "MA 20/50, Volume Profile",
          "ทำเครื่องหมายแนวรับ/แนวต้านหลัก"
        ]
      },
      {
        title: "เงื่อนไขเข้า",
        bullets: [
          "ราคาเหนือ MA50 และ MA20 > MA50",
          "Volume ดีกว่าค่าเฉลี่ย 20 แท่ง",
          "ย่อกลับมาใกล้ MA20 พร้อมแท่งกลับตัว"
        ]
      },
      {
        title: "บริหารความเสี่ยง",
        bullets: [
          "SL ใต้ Swing ล่าสุด 1 ATR",
          "TP1 ที่ +1R, เลื่อน SL ตาม MA20",
          "ปิดทั้งหมดเมื่อ MA20 ตัดลง MA50"
        ]
      }
    ],
    metrics: ["RR≥1:2", "Winrate ~45–55%", "Max 2 ตำแหน่งพร้อมกัน"],
    cta: { text: "LINE สั่งซื้อ/สอบถาม", url: "https://line.me/ti/p/~longtrade" }
  },
  {
    id: "breakout-box",
    title: "กล่องสะสม → เบรกเอาท์",
    summary: "ใช้โครงสร้างกล่อง + Volume ยืนยันการหลุดกรอบ",
    category: "Breakout",
    image: "https://picsum.photos/seed/usecase2/1200/675",
    tools: ["Box Range", "Volume Spike", "EA: Alert"],
    steps: [
      { title: "ประกอบกล่อง", bullets: ["ตีกรอบ High/Low 20–40 แท่ง", "โวลลุ่มเบาบางระหว่างสะสม"] },
      { title: "เข้าเมื่อหลุด", bullets: ["แท่งปิดนอกกล่อง + วอลุ่มพุ่ง", "รอรีเทสต์ขอบกล่อง", "เข้าตามทิศรีเทสต์สำเร็จ"] },
      { title: "ออก/ลากกำไร", bullets: ["SL กลับเข้ากล่อง", "TP = ความสูงกล่อง x1–1.5", "ตามด้วย Trailing 1 ATR"] }
    ],
    metrics: ["Fakeout ต่ำลงเมื่อรอรีเทสต์", "RR 1:1.2–1:2"]
  },
  {
    id: "range-revert",
    title: "แกว่งในกรอบ (Mean Reversion)",
    summary: "ซื้อขอบล่าง–ขายขอบบน เมื่อไม่มีเทรนด์ชัด",
    category: "Range",
    image: "https://picsum.photos/seed/usecase3/1200/675",
    tools: ["RSI/Stoch", "Support/Resistance", "Ebook: Range Play"],
    steps: [
      { title: "ยืนยันช่วงไซด์เวย์", bullets: ["ADX < 20", "MA20 แบน", "ความผันผวนลดลง"] },
      { title: "จังหวะเข้า", bullets: ["RSI<30 ใกล้ขอบล่าง + สัญญาณกลับตัว", "ขายเมื่อ RSI>70 ใกล้ขอบบน"] },
      { title: "บริหารความเสี่ยง", bullets: ["SL นอกกรอบ 0.5–1 ATR", "ปิดกลางกรอบถ้าโมเมนตัมหาย"] }
    ]
  },
  {
    id: "news-momentum",
    title: "โมเมนตัมหลังข่าว",
    summary: "เข้าตามทิศโมเมนตัมหลังประกาศข่าวแรง ๆ",
    category: "News",
    image: "https://picsum.photos/seed/usecase4/1200/675",
    tools: ["Calendar Alert", "Volume Pulse", "EA: Risk Guard"],
    steps: [
      { title: "เตรียมก่อนข่าว", bullets: ["หลีกเลี่ยงเข้าใกล้เวลาออกข่าว 10–15 นาที", "วางแผน 2 ทาง: เบรคขึ้น/ลง"] },
      { title: "หลังข่าว", bullets: ["รอแท่งยืนยันทิศ + วอลุ่มจริง", "เข้าตามทิศหากไม่รีเจกแรง"] },
      { title: "คุมความเสี่ยง", bullets: ["ขนาดเล็กลงครึ่งหนึ่ง", "SL สั้น 0.5–0.8 ATR", "ปิดเร็วเมื่อโมเมนตัมหาย"] }
    ]
  }
] satisfies UseCase[];
