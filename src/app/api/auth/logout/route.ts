import { NextResponse } from "next/server";
import {
  deleteUserSession,
  isSameOriginRequest,
  USER_SESSION_COOKIE,
} from "@/lib/user-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
  }
  try {
    await deleteUserSession(request);
    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(USER_SESSION_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Chưa thể đăng xuất. Vui lòng thử lại." }, { status: 503 });
  }
}
