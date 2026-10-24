import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/user-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    return NextResponse.json({ user }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Chưa thể kết nối tài khoản." }, { status: 503 });
  }
}
