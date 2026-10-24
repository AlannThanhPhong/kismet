import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getAuthUser, isSameOriginRequest } from "@/lib/user-auth";
import type { PublishedTrialPayload } from "@/lib/published-trials-store";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };
type StoredTrial = PublishedTrialPayload & { _id: string };

export async function PATCH(request: Request, context: Context) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
  }

  try {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: "Vui lòng đăng nhập." }, { status: 401 });
    if (!user.isAdmin) return NextResponse.json({ error: "Bạn không có quyền quản lý thiệp." }, { status: 403 });

    const { id } = await context.params;
    if (!id || !/^[a-zA-Z0-9_-]{4,60}$/.test(id)) {
      return NextResponse.json({ error: "Mã thiệp không hợp lệ." }, { status: 400 });
    }

    let body: { disabled?: unknown };
    try {
      body = await request.json() as { disabled?: unknown };
    } catch {
      return NextResponse.json({ error: "Trạng thái thiệp không hợp lệ." }, { status: 400 });
    }
    if (typeof body?.disabled !== "boolean") {
      return NextResponse.json({ error: "Trạng thái thiệp không hợp lệ." }, { status: 400 });
    }

    const db = await getDatabase();
    const trials = db.collection<StoredTrial>("published_trials");
    const result = body.disabled
      ? await trials.updateOne({ _id: id }, { $set: { disabledAt: new Date().toISOString() } })
      : await trials.updateOne({ _id: id }, { $unset: { disabledAt: "" } });
    if (!result.matchedCount) return NextResponse.json({ error: "Không tìm thấy thiệp." }, { status: 404 });

    return NextResponse.json({ ok: true, disabled: body.disabled }, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Could not update published trial status:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Chưa thể cập nhật trạng thái thiệp." }, { status: 503 });
  }
}
