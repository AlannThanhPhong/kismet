import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getAuthUser, type AuthUser } from "@/lib/user-auth";
import {
  getPublishedTrialExpiry,
  type PublishedTrialPayload,
} from "@/lib/published-trials-store";

export const runtime = "nodejs";
export const maxDuration = 30;

type Context = { params: Promise<{ id: string }> };
type StoredTrial = PublishedTrialPayload & { _id: string };

export async function GET(request: Request, context: Context) {
  const { id } = await context.params;
  if (!id || !/^[a-zA-Z0-9_-]{4,60}$/.test(id)) {
    return NextResponse.json({ error: "Mã bản thiệp không hợp lệ." }, { status: 400 });
  }
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: "Dịch vụ lưu thiệp chưa được cấu hình." }, { status: 503 });
  }

  try {
    const db = await getDatabase();
    const record = await db.collection<StoredTrial>("published_trials").findOne({ _id: id });
    if (!record) {
      return NextResponse.json({ error: "Không tìm thấy thiệp này." }, { status: 404 });
    }

    const expiry = getPublishedTrialExpiry(record);
    const expiresAt = expiry?.toISOString() ?? null;
    if (!expiry || expiry.getTime() <= Date.now()) {
      return NextResponse.json({
        error: "Thiệp này đã hết hạn.",
        status: "expired",
        createdAt: record.createdAt,
        expiresAt,
      }, { status: 410, headers: { "Cache-Control": "no-store" } });
    }

    const { _id: _storedId, ownerId, ownerEmail: _ownerEmail, ...publicRecord } = record;
    let user: AuthUser | null = null;
    try {
      user = await getAuthUser(request);
    } catch {
      // Owner details are optional for viewing a public invitation.
    }
    return NextResponse.json({
      record: { ...publicRecord, expiresAt },
      status: "active",
      canEdit: Boolean(user && user.id === ownerId),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Could not load published trial:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Chưa thể tải thiệp. Vui lòng thử lại sau." }, { status: 503 });
  }
}
