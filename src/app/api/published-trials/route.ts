import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

export interface PublishedTrialPayload {
  id: string;
  templateCode: string;
  title?: string;
  imageMap: Record<string, string>;
  textMap: Record<string, string>;
  musicSrc?: string;
  musicTitle?: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), ".data", "published-trials");

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu JSON không hợp lệ" }, { status: 400 });
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

  // 1. Always persist to local server disk (.data/published-trials) so it works even without MongoDB
  try {
    await mkdir(DATA_DIR, { recursive: true });
    const filePath = path.join(DATA_DIR, `${id}.json`);
    await writeFile(filePath, JSON.stringify(record), "utf8");
  } catch (err) {
    console.warn("Could not write published trial to local disk:", err);
  }

  // 2. Also persist to MongoDB if configured
  if (process.env.MONGODB_URI) {
    try {
      const db = await getDatabase();
      await db
        .collection<PublishedTrialPayload & { _id: string }>("published_trials")
        .updateOne({ _id: id }, { $set: { ...record, _id: id } }, { upsert: true });
    } catch (err) {
      console.warn("Could not save published trial to MongoDB:", err);
    }
  }

  const shareUrl = `/thiep/${encodeURIComponent(templateCode)}?custom=${encodeURIComponent(id)}`;
  return NextResponse.json({ ok: true, id, shareUrl, record }, { status: 201 });
}
