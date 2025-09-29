import { NextResponse } from "next/server";

const GS_ENDPOINT = process.env.GS_ENDPOINT!; // ต้องลงท้าย /exec

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    if (!GS_ENDPOINT) {
      console.error("Missing GS_ENDPOINT env");
      return NextResponse.json({ ok: false, error: "GS_ENDPOINT not set" }, { status: 500 });
    }

    // เติมข้อมูลเสริมให้ครบ
    const payload = {
      name: body.name || "",
      email: body.email || "",
      account: body.account || "",
      phone: body.phone || "",
      page: body.page || "",      // ตำแหน่งหน้า เช่น "/indicators/goldflow"
      source: body.source || "",  // เช่น "goldflow-xm-modal"
    };

    const res = await fetch(GS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // อย่าใส่ mode:'no-cors' ในฝั่ง server — จะทำให้อ่านผลไม่ได้
    });

    // บางที Apps Script ตอบเป็น text/plain; พยายามแปลงเป็น JSON
    const text = await res.text();
    let data: any = null;
    try { data = JSON.parse(text); } catch { data = { ok: res.ok, raw: text }; }

    if (!res.ok || !data?.ok) {
      console.error("GAS error:", data || text);
      return NextResponse.json(
        { ok: false, error: "gas_failed", detail: data || text },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("API /api/lead error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
