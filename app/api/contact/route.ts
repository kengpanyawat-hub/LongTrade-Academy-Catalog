// app/api/contact/route.ts
import { NextResponse } from "next/server";

type FormShape = Record<string, string>;

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // แปลง FormData -> object โดยไม่ใช้ entries()
    const data: FormShape = {};
    form.forEach((value, key) => {
      // ถ้าเป็นไฟล์ เก็บเป็นชื่อไฟล์เพื่อให้ JSON ได้
      data[key] = typeof value === "string" ? value : (value as File).name;
    });

    // ใช้งานต่อได้ตามต้องการ (บันทึก DB / ส่งอีเมล / webhook ฯลฯ)
    // console.log("CONTACT_FORM:", data);

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error)?.message ?? "Unknown error" },
      { status: 400 }
    );
  }
}

// (ออปชัน) ใช้ตรวจเช็คว่า route ทำงานได้
export async function GET() {
  return NextResponse.json({ ok: true });
}
