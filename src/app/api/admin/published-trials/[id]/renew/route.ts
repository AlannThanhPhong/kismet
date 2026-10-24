import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getAuthUser, isSameOriginRequest } from "@/lib/user-auth";
import {
  getPublishedTrialExpiry,
  PUBLISHED_TRIAL_LIFETIME_MS,
  type PublishedTrialPayload,
} from "@/lib/published-trials-store";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };
type StoredTrial = PublishedTrialPayload & { _id: string };

export async function POST(request: Request, context: Context) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
  }

  try {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: "Vui lòng đăng nhập." }, { status: 401 });
    if (!user.isAdmin) return NextResponse.json({ error: "Bạn không có quyền gia hạn thiệp." }, { status: 403 });

    const { id } = await context.params;
    if (!id || !/^[a-zA-Z0-9_-]{4,60}$/.test(id)) {
      return NextResponse.json({ error: "Mã thiệp không hợp lệ." }, { status: 400 });
    }

    const db = await getDatabase();
    const trials = db.collection<StoredTrial>("published_trials");
    const record = await trials.findOne({ _id: id });
    if (!record) return NextResponse.json({ error: "Không tìm thấy thiệp." }, { status: 404 });

    const now = new Date();
    const currentExpiry = getPublishedTrialExpiry(record);
    const base = currentExpiry && currentExpiry.getTime() > now.getTime() ? currentExpiry : now;
    const expiresAt = new Date(base.getTime() + PUBLISHED_TRIAL_LIFETIME_MS).toISOString();
    const renewedAt = now.toISOString();
    const renewalCount = (record.renewalCount || 0) + 1;
    await trials.updateOne({ _id: id }, { $set: { expiresAt, renewedAt, renewalCount } });

    return NextResponse.json({ ok: true, expiresAt, renewedAt, renewalCount }, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Could not renew published trial:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Chưa thể gia hạn thiệp." }, { status: 503 });
  }
}
