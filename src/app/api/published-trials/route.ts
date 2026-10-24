import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getAuthUser, isSameOriginRequest, type AuthUser } from "@/lib/user-auth";
import {
  getPublishedTrialExpiry,
  PUBLISHED_TRIAL_LIFETIME_MS,
  type PublishedTrialPayload,
} from "@/lib/published-trials-store";

export const runtime = "nodejs";
export const maxDuration = 30;

type StoredTrial = PublishedTrialPayload & { _id: string };
const MAX_BODY_BYTES = 12 * 1024 * 1024;

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 403 });
  }

  let user: AuthUser | null;
  try {
    user = await getAuthUser(request);
  } catch {
    return NextResponse.json({ error: "Chưa thể kết nối tài khoản. Vui lòng thử lại." }, { status: 503 });
  }
  if (!user) {
    return NextResponse.json({ error: "Vui lòng đăng nhập trước khi xuất bản thiệp." }, { status: 401 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Dữ liệu thiệp quá lớn. Vui lòng bỏ nhạc tải lên rồi thử lại." }, { status: 413 });
  }

  let input: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Dữ liệu thiệp quá lớn. Vui lòng bỏ nhạc tải lên rồi thử lại." }, { status: 413 });
    }
    input = raw ? JSON.parse(raw) as Record<string, unknown> : {};
  } catch {
    return NextResponse.json({ error: "Dữ liệu thiệp không hợp lệ." }, { status: 400 });
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return NextResponse.json({ error: "Dữ liệu thiệp không hợp lệ." }, { status: 400 });
  }

  const templateCode = typeof input.templateCode === "string" ? input.templateCode.trim().slice(0, 120) : "";
  if (!templateCode) {
    return NextResponse.json({ error: "Thiếu mã mẫu thiệp." }, { status: 400 });
  }

  const rawImageMap = input.imageMap && typeof input.imageMap === "object" ? input.imageMap as Record<string, unknown> : {};
  const rawTextMap = input.textMap && typeof input.textMap === "object" ? input.textMap as Record<string, unknown> : {};
  const imageMap: Record<string, string> = {};
  const textMap: Record<string, string> = {};
  for (const [key, value] of Object.entries(rawImageMap)) {
    if (typeof value === "string" && value.length > 0 && key.length <= 200) imageMap[key] = value;
  }
  for (const [key, value] of Object.entries(rawTextMap)) {
    if (typeof value === "string" && key.length <= 200) textMap[key] = value.slice(0, 4000);
  }

  const id = typeof input.id === "string" && /^[a-zA-Z0-9_-]{4,40}$/.test(input.id)
    ? input.id
    : `trial-${Date.now().toString(36)}-${randomBytes(5).toString("hex")}`;

  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: "MongoDB chưa được cấu hình nên chưa thể lưu thiệp." }, { status: 503 });
  }

  try {
    const db = await getDatabase();
    const trials = db.collection<StoredTrial>("published_trials");
    const existing = await trials.findOne({ _id: id });
    const now = new Date();
    let record: PublishedTrialPayload;

    if (existing) {
      if (!existing.ownerId || existing.ownerId !== user.id) {
        return NextResponse.json({ error: "Thiệp này thuộc một tài khoản khác." }, { status: 403 });
      }
      const existingExpiry = getPublishedTrialExpiry(existing);
      if (!existingExpiry || existingExpiry.getTime() <= now.getTime()) {
        return NextResponse.json({ error: "Thiệp đã hết hạn. Chỉ quản trị viên mới có thể gia hạn." }, { status: 410 });
      }

      record = {
        id,
        templateCode,
        title: typeof input.title === "string" ? input.title.slice(0, 200) : undefined,
        imageMap,
        textMap,
        musicSrc: typeof input.musicSrc === "string" ? input.musicSrc : undefined,
        musicTitle: typeof input.musicTitle === "string" ? input.musicTitle.slice(0, 160) : undefined,
        createdAt: existing.createdAt,
        expiresAt: existingExpiry.toISOString(),
        ownerId: existing.ownerId,
        ownerEmail: existing.ownerEmail || user.email,
        renewedAt: existing.renewedAt,
        renewalCount: existing.renewalCount || 0,
      };
      const update = await trials.updateOne(
        { _id: id, ownerId: user.id, expiresAt: { $gt: now.toISOString() } },
        { $set: record },
      );
      if (!update.matchedCount) {
        return NextResponse.json({ error: "Thiệp đã hết hạn. Chỉ quản trị viên mới có thể gia hạn." }, { status: 410 });
      }
    } else {
      const createdAt = now.toISOString();
      record = {
        id,
        templateCode,
        title: typeof input.title === "string" ? input.title.slice(0, 200) : undefined,
        imageMap,
        textMap,
        musicSrc: typeof input.musicSrc === "string" ? input.musicSrc : undefined,
        musicTitle: typeof input.musicTitle === "string" ? input.musicTitle.slice(0, 160) : undefined,
        createdAt,
        expiresAt: new Date(now.getTime() + PUBLISHED_TRIAL_LIFETIME_MS).toISOString(),
        ownerId: user.id,
        ownerEmail: user.email,
        renewalCount: 0,
      };
      await trials.insertOne({ ...record, _id: id });
    }

    const shareUrl = `/thiep/${encodeURIComponent(templateCode)}?custom=${encodeURIComponent(id)}`;
    return NextResponse.json({ ok: true, id, shareUrl, createdAt: record.createdAt, expiresAt: record.expiresAt }, {
      status: existing ? 200 : 201,
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json({ error: "Mã thiệp đã được dùng. Vui lòng xuất bản lại." }, { status: 409 });
    }
    console.error("Could not save published trial to MongoDB:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Không thể lưu thiệp vào MongoDB. Vui lòng thử lại." }, { status: 503 });
  }
}
