import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { PublishedTrialPayload } from "../route";

export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), ".data", "published-trials");

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  if (!id || !/^[a-zA-Z0-9_-]{4,60}$/.test(id)) {
    return NextResponse.json({ error: "Mã bản xem thử không hợp lệ" }, { status: 400 });
  }

  // 1. Try reading from local server disk first (fast and works without MongoDB)
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    const content = await readFile(filePath, "utf8");
    const record = JSON.parse(content) as PublishedTrialPayload;
    return NextResponse.json({ record }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    // Fall back to MongoDB if not on local disk
  }

  // 2. Try reading from MongoDB if configured
  if (process.env.MONGODB_URI) {
    try {
      const db = await getDatabase();
      const record = await db
        .collection<PublishedTrialPayload & { _id: string }>("published_trials")
        .findOne({ _id: id });
      if (record) {
        return NextResponse.json({ record }, { headers: { "Cache-Control": "no-store" } });
      }
    } catch {
      // Ignore DB error
    }
  }

  return NextResponse.json({ error: "Không tìm thấy bản thiệp xem thử này" }, { status: 404 });
}
