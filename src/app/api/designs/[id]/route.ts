import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getCatalog } from "@/lib/storefront-catalog";
import { validDraft, type DesignDraft } from "@/lib/design-draft";

type Context = { params: Promise<{ id: string }> };
const COOKIE = "kismet-design-session";
const validOwner = (value: string | undefined) => value && /^[a-f0-9]{64}$/.test(value) ? value : null;
const validId = (id: string) => getCatalog("VND").some(item => item.id === id && !item.template);
const fail = (error: string, status: number) => NextResponse.json({ error }, { status, headers: { "Cache-Control": "private, no-store" } });

export async function GET(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const owner = validOwner(request.cookies.get(COOKIE)?.value);
  if (!validId(id) || !owner) return fail("Chưa có bản nháp đám mây trong phiên này.", 404);
  try {
    const db = await getDatabase();
    const record = await db.collection<{ _id: string; draft: DesignDraft }>("design_drafts").findOne({ _id: `${owner}:${id}` });
    if (!record) return fail("Chưa có bản nháp đám mây cho mẫu này.", 404);
    return NextResponse.json({ draft: record.draft }, { headers: { "Cache-Control": "private, no-store" } });
  } catch { return fail("Chưa thể kết nối đám mây. Bản trên thiết bị vẫn được giữ.", 503); }
}

export async function PUT(request: NextRequest, context: Context) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return fail("Yêu cầu không hợp lệ.", 403);
  const { id } = await context.params;
  if (!validId(id)) return fail("Không tìm thấy mẫu thiệp.", 404);
  if (Number(request.headers.get("content-length")) > 64000) return fail("Bản nháp quá lớn.", 413);
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > 64000) return fail("Bản nháp quá lớn.", 413);
  let draft: unknown;
  try { draft = JSON.parse(raw); } catch { return fail("Bản nháp không hợp lệ.", 400); }
  if (!validDraft(draft)) return fail("Bản nháp không hợp lệ.", 400);
  const owner = validOwner(request.cookies.get(COOKIE)?.value) ?? randomBytes(32).toString("hex");
  try {
    const db = await getDatabase();
    await db.collection<{ _id: string; draft: DesignDraft; updatedAt: Date }>("design_drafts").updateOne({ _id: `${owner}:${id}` }, { $set: { draft, updatedAt: new Date() } }, { upsert: true });
    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "private, no-store" } });
    response.cookies.set(COOKIE, owner, { httpOnly: true, sameSite: "strict", secure: request.nextUrl.protocol === "https:", path: "/api/designs", maxAge: 60 * 60 * 24 * 180 });
    return response;
  } catch { return fail("Chưa thể lưu lên đám mây. Bản trên thiết bị vẫn được giữ.", 503); }
}
