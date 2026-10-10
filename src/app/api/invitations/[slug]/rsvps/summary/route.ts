import { NextResponse } from "next/server";
import { getRsvpSummary } from "@/lib/rsvp-summary";
import { hasGuestbookAccess } from "@/lib/guestbook-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!await hasGuestbookAccess(slug, request.headers.get("cookie") ?? ""))
      return NextResponse.json({ error: "Vui lòng nhập mật khẩu để xem lời chúc" }, { status: 401, headers: { "Cache-Control": "no-store" } });
    const summary = await getRsvpSummary(slug);
    return NextResponse.json(summary ?? { error: "Không tìm thấy thiệp" }, {
      status: summary ? 200 : 404, headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Chưa tải được lời chúc. Vui lòng thử lại." }, { status: 503 });
  }
}
