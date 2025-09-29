import { NextResponse } from "next/server";

type Payload = {
  text: string;        // ข้อความที่จะส่ง
  parseMode?: "HTML" | "MarkdownV2" | "Markdown";
  chatId?: string;     // ถ้าไม่ส่งมา จะใช้จาก ENV
};

export async function POST(req: Request) {
  try {
    const { text, parseMode, chatId }: Payload = await req.json();
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = chatId || process.env.TELEGRAM_CHAT_ID;

    if (!token || !chat_id) {
      return NextResponse.json(
        { ok: false, error: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID" },
        { status: 500 }
      );
    }

    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // รองรับแค่ข้อความธรรมดาหรือ HTML ก็พอ (escape ให้ปลอดภัยเองถ้าเป็น MarkdownV2)
      body: JSON.stringify({ chat_id, text, parse_mode: parseMode || "HTML" }),
      cache: "no-store",
    });

    const res = await tg.json().catch(() => ({}));
    if (!tg.ok || res?.ok === false) {
      return NextResponse.json({ ok: false, error: res?.description || "TG error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
