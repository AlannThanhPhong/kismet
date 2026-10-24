import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getMemoryTrialStore, type PublishedTrialPayload } from "@/lib/published-trials-store";

export const runtime = "nodejs";
export const maxDuration = 30;

const DATA_DIR = path.join(process.cwd(), ".data", "published-trials");
const TMP_DATA_DIR = path.join(os.tmpdir(), "kismet-published-trials");

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  if (!id || !/^[a-zA-Z0-9_-]{4,60}$/.test(id)) {
    return NextResponse.json({ error: "Mã bản xem thử không hợp lệ" }, { status: 400 });
  }

  // MongoDB is the source of truth for published invitations and their Cloudinary URLs.
  if (process.env.MONGODB_URI) {
    try {
      const db = await getDatabase();
      const record = await db
        .collection<PublishedTrialPayload & { _id: string }>("published_trials")
        .findOne({ _id: id });
      if (record) {
        getMemoryTrialStore().set(id, record);
        return NextResponse.json({ record }, { headers: { "Cache-Control": "no-store" } });
      }
    } catch {
      // Ignore DB error
    }
  }

  // Fall back to process memory and disk if MongoDB is unavailable (for local drafts).
  const memRecord = getMemoryTrialStore().get(id);
  if (memRecord) {
    return NextResponse.json({ record: memRecord }, { headers: { "Cache-Control": "no-store" } });
  }

  for (const dir of [DATA_DIR, TMP_DATA_DIR]) {
    try {
      const filePath = path.join(dir, `${id}.json`);
      const content = await readFile(filePath, "utf8");
      const record = JSON.parse(content) as PublishedTrialPayload;
      getMemoryTrialStore().set(id, record);
      return NextResponse.json({ record }, { headers: { "Cache-Control": "no-store" } });
    } catch {
      // Try next fallback
    }
  }

  return NextResponse.json({ error: "Không tìm thấy bản thiệp xem thử này" }, { status: 404 });
}
