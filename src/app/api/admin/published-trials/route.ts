import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/user-auth";
import { getPublishedTrialExpiry, type PublishedTrialPayload } from "@/lib/published-trials-store";

export const runtime = "nodejs";

type StoredTrial = PublishedTrialPayload & { _id: string };

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: "Vui lòng đăng nhập." }, { status: 401 });
    if (!user.isAdmin) return NextResponse.json({ error: "Bạn không có quyền quản trị." }, { status: 403 });

    const db = await getDatabase();
    const records = await db.collection<StoredTrial>("published_trials")
      .find({})
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();
    const now = Date.now();
    const trials = records.map((record) => {
      const expiry = getPublishedTrialExpiry(record);
      const expiresAt = expiry?.toISOString() ?? null;
      const remaining = expiry ? expiry.getTime() - now : 0;
      const disabled = Boolean(record.disabledAt);
      return {
        id: record.id || record._id,
        templateCode: record.templateCode,
        title: record.title,
        createdAt: record.createdAt,
        ownerEmail: record.ownerEmail || null,
        expiresAt,
        disabledAt: record.disabledAt || null,
        renewalCount: record.renewalCount || 0,
        status: disabled ? "disabled" as const : remaining > 0 ? "active" as const : "expired" as const,
        daysRemaining: remaining > 0 ? Math.ceil(remaining / (24 * 60 * 60 * 1000)) : 0,
      };
    });
    return NextResponse.json({ trials }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Could not load admin trial list:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Chưa thể tải danh sách quản trị." }, { status: 503 });
  }
}
