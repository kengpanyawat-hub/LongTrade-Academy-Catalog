import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ปกป้องเบื้องต้น
    if (!body?.email || !body?.name) {
      return NextResponse.json({ ok: false, message: "invalid" }, { status: 400 });
    }

    const webhook = process.env.GS_ENDPOINT;
    if (!webhook) {
      return NextResponse.json({ ok: false, message: "no_webhook" }, { status: 500 });
    }

    // ส่งต่อไป Google Apps Script (method: POST)
    const r = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // บาง script ต้องการ no-cors/อื่น ๆ แล้วแต่การตั้งค่า
    });

    if (!r.ok) {
      return NextResponse.json({ ok: false }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
