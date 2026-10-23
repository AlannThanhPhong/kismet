import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getMemoryTrialStore, type PublishedTrialPayload } from "@/lib/published-trials-store";

export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), ".data", "published-trials");
const TMP_DATA_DIR = path.join(os.tmpdir(), "kismet-published-trials");

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  if (!id || !/^[a-zA-Z0-9_-]{4,60}$/.test(id)) {
    return NextResponse.json({ error: "Mã bản xem thử không hợp lệ" }, { status: 400 });
  }

  // 1. Check in-memory store first
  const memRecord = getMemoryTrialStore().get(id);
  if (memRecord) {
    return NextResponse.json({ record: memRecord }, { headers: { "Cache-Control": "no-store" } });
  }

  // 2. Try reading from local server disk (.data or tmpdir)
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

  // 3. Try reading from MongoDB if configured (bounded by 2.5s timeout)
  if (process.env.MONGODB_URI) {
    try {
      const record = await Promise.race([
        (async () => {
          const db = await getDatabase();
          return db
            .collection<PublishedTrialPayload & { _id: string }>("published_trials")
            .findOne({ _id: id });
        })(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
      ]);
      if (record) {
        getMemoryTrialStore().set(id, record);
        return NextResponse.json({ record }, { headers: { "Cache-Control": "no-store" } });
      }
    } catch {
      // Ignore DB error
    }
  }

  return NextResponse.json({ error: "Không tìm thấy bản thiệp xem thử này" }, { status: 404 });
}
