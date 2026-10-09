import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: "Yêu cầu không hợp lệ" }, { status: 403 });
  if (Number(request.headers.get("content-length")) > 4096) return NextResponse.json({ error: "Yêu cầu quá lớn" }, { status: 413 });
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Yêu cầu không hợp lệ" }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Yêu cầu không hợp lệ" }, { status: 400 });
  if (body.website) return NextResponse.json({ ok: true });
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body.consent !== true) return NextResponse.json({ error: "Vui lòng nhập email hợp lệ và đồng ý nhận bản tin" }, { status: 400 });
  try {
    const db = await getDatabase();
    await db.collection("newsletter_subscribers").updateOne({ _id: email as never }, { $setOnInsert: { email, consent: true, source: "white-storefront", subscribedAt: new Date() } }, { upsert: true });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Chưa thể đăng ký lúc này Vui lòng thử lại sau" }, { status: 503 });
  }
}
