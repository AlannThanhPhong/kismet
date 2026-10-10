import { NextRequest, NextResponse } from "next/server";
import { checkGuestbookPassword, createGuestbookSession, guestbookCode, guestbookCookie,
  guestbookSessionSeconds, revokeGuestbookSession } from "@/lib/guestbook-access";

export const runtime = "nodejs";
const cookieOptions = { httpOnly: true, sameSite: "strict" as const, secure: process.env.NODE_ENV === "production", path: "/" };

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if ((await params).slug !== guestbookCode) return NextResponse.json({ error: "Không tìm thấy sổ lưu bút" }, { status: 404 });
  if (request.headers.get("origin") && request.headers.get("origin") !== request.nextUrl.origin)
    return NextResponse.json({ error: "Yêu cầu không hợp lệ" }, { status: 403 });
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Yêu cầu không hợp lệ" }, { status: 400 }); }
  if (!checkGuestbookPassword(body?.password)) return NextResponse.json({ error: "Mật khẩu chưa đúng. Bạn thử lại nhé." }, { status: 401 });
  try {
    const token = await createGuestbookSession();
    const response = NextResponse.json({ opened: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(guestbookCookie, token, { ...cookieOptions, maxAge: guestbookSessionSeconds });
    return response;
  } catch { return NextResponse.json({ error: "Chưa mở được sổ lưu bút. Vui lòng thử lại." }, { status: 503 }); }
}
export async function DELETE(request: NextRequest) {
  if (request.headers.get("origin") && request.headers.get("origin") !== request.nextUrl.origin)
    return NextResponse.json({ error: "Yêu cầu không hợp lệ" }, { status: 403 });
  try {
    await revokeGuestbookSession(request.cookies.get(guestbookCookie)?.value);
    const response = NextResponse.json({ closed: true });
    response.cookies.set(guestbookCookie, "", { ...cookieOptions, maxAge: 0 });
    return response;
  } catch { return NextResponse.json({ error: "Chưa khóa được sổ lưu bút" }, { status: 503 }); }
}
