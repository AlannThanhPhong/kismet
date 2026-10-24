import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getMemoryTrialStore, type PublishedTrialPayload } from "@/lib/published-trials-store";

export const runtime = "nodejs";
export const maxDuration = 30;

const DATA_DIR = path.join(process.cwd(), ".data", "published-trials");
const TMP_DATA_DIR = path.join(os.tmpdir(), "kismet-published-trials");

export async function POST(request: Request) {
  let body: unknown;
  try {
    const rawText = await request.text();
    body = rawText ? JSON.parse(rawText) : null;
  } catch {
    return NextResponse.json({ error: "Dữ liệu JSON không hợp lệ hoặc quá lớn" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Dữ liệu thiệp không hợp lệ" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const templateCode = typeof input.templateCode === "string" ? input.templateCode.trim() : "";
  if (!templateCode) {
    return NextResponse.json({ error: "Thiếu mã mẫu thiệp (templateCode)" }, { status: 400 });
  }

  const rawImageMap = input.imageMap && typeof input.imageMap === "object" ? (input.imageMap as Record<string, unknown>) : {};
  const rawTextMap = input.textMap && typeof input.textMap === "object" ? (input.textMap as Record<string, unknown>) : {};

  const imageMap: Record<string, string> = {};
  for (const [k, v] of Object.entries(rawImageMap)) {
    if (typeof v === "string" && v.length > 0) {
      imageMap[k] = v;
    }
  }

  const textMap: Record<string, string> = {};
  for (const [k, v] of Object.entries(rawTextMap)) {
    if (typeof v === "string") {
      textMap[k] = v;
    }
  }

  const id =
    typeof input.id === "string" && /^[a-zA-Z0-9_-]{4,40}$/.test(input.id)
      ? input.id
      : `trial-${Date.now().toString(36)}-${randomBytes(3).toString("hex")}`;

  const record: PublishedTrialPayload = {
    id,
    templateCode,
    title: typeof input.title === "string" ? input.title.slice(0, 200) : undefined,
    imageMap,
    textMap,
    musicSrc: typeof input.musicSrc === "string" ? input.musicSrc : undefined,
    musicTitle: typeof input.musicTitle === "string" ? input.musicTitle.slice(0, 160) : undefined,
    createdAt: new Date().toISOString(),
  };

  const hasCloudinaryImages = Object.values(imageMap).some((url) =>
    /^https:\/\/res\.cloudinary\.com\//i.test(url),
  );

  if (hasCloudinaryImages && !process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "Chưa kết nối MongoDB nên chưa thể lưu bản thiệp có ảnh Cloudinary để chia sẻ." },
      { status: 503 },
    );
  }

  // Cloudinary URLs must be saved with the invitation in the existing MongoDB database
  // before the share link is reported as published.
  if (process.env.MONGODB_URI) {
    try {
      const db = await getDatabase();
      await db
        .collection<PublishedTrialPayload & { _id: string }>("published_trials")
        .updateOne({ _id: id }, { $set: record }, { upsert: true });
    } catch (error) {
      console.warn("Could not save published trial to MongoDB:", error);
      if (hasCloudinaryImages) {
        return NextResponse.json(
          { error: "Không thể lưu bản thiệp và ảnh lên MongoDB. Vui lòng thử xuất bản lại." },
          { status: 503 },
        );
      }
    }
  }

  // Keep a small memory cache and a disk fallback for drafts without Cloudinary images.
  const memStore = getMemoryTrialStore();
  if (memStore.size >= 60) {
    const oldestKey = memStore.keys().next().value;
    if (oldestKey) memStore.delete(oldestKey);
  }
  memStore.set(id, record);

  // 2. Persist to local server disk (.data/published-trials or os.tmpdir fallback)
  const serialized = JSON.stringify(record);
  try {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(path.join(DATA_DIR, `${id}.json`), serialized, "utf8");
  } catch {
    try {
      await mkdir(TMP_DATA_DIR, { recursive: true });
      await writeFile(path.join(TMP_DATA_DIR, `${id}.json`), serialized, "utf8");
    } catch (err) {
      console.warn("Could not write published trial to disk:", err);
    }
  }

  const shareUrl = `/thiep/${encodeURIComponent(templateCode)}?custom=${encodeURIComponent(id)}`;
  return NextResponse.json({ ok: true, id, shareUrl }, { status: 201 });
}
