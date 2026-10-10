import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { Invitation, Rsvp } from "@/lib/models";
import { designedInvitations } from "@/lib/designed-invitations";
import { createHash } from "node:crypto";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON không hợp lệ" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Thông tin phản hồi không hợp lệ" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const guestName = typeof input.guestName === "string" ? input.guestName.trim() : "";
  const attending = input.attending;
  const guestCount = input.guestCount === undefined ? 1 : input.guestCount;
  const message = typeof input.message === "string" ? input.message.trim() : undefined;
  const responseToken = input.responseToken;

  if (!guestName || guestName.length > 120 || typeof attending !== "boolean" ||
      !Number.isInteger(guestCount) || (guestCount as number) < 1 || (guestCount as number) > 20 ||
      (message?.length ?? 0) > 1000 ||
      (input.publishMessage !== undefined && typeof input.publishMessage !== "boolean") ||
      (responseToken !== undefined && (typeof responseToken !== "string" || !/^[a-f0-9-]{36}$/i.test(responseToken)))) {
    return NextResponse.json({ error: "Tên khách, xác nhận tham dự hoặc số lượng khách không hợp lệ" }, { status: 400 });
  }

  try {
    const { slug } = await params;
    const db = await getDatabase();
    const invitations = db.collection<Invitation>("invitations");
    const design = designedInvitations.find((item) => item.slug === slug);
    if (design) {
      await invitations.updateOne({ code: design.code }, { $setOnInsert: {
        ...design, event: { ...design.event, date: new Date(design.event.date) }, createdAt: new Date(), updatedAt: new Date(),
      } }, { upsert: true });
    }
    const invitation = await invitations.findOne({ slug });
    if (!invitation) return NextResponse.json({ error: "Không tìm thấy thiệp" }, { status: 404 });

    const rsvp: Omit<Rsvp, "_id"> = {
      invitationId: invitation._id,
      guestName,
      attending,
      guestCount: attending ? guestCount as number : 0,
      ...(message ? { message } : {}),
      publishMessage: slug === "20260823-NDTD" || input.publishMessage === true,
      createdAt: new Date(),
    };
    const responses = db.collection<Rsvp>("rsvps");
    if (typeof responseToken === "string") {
      const responseTokenHash = createHash("sha256").update(responseToken).digest("hex");
      // The unique partial index makes retrying or editing one guest's response atomic.
      await responses.createIndex({ invitationId: 1, responseTokenHash: 1 }, {
        unique: true, partialFilterExpression: { responseTokenHash: { $type: "string" } },
      });
      const { createdAt, ...changes } = rsvp;
      const result = await responses.updateOne({ invitationId: invitation._id, responseTokenHash }, {
        $set: { ...changes, message: message || "", updatedAt: new Date() },
        $setOnInsert: { createdAt, responseTokenHash },
      }, { upsert: true });
      return NextResponse.json({ saved: true, updated: result.upsertedCount === 0 }, { status: result.upsertedCount ? 201 : 200 });
    }
    const result = await responses.insertOne(rsvp as Rsvp);
    return NextResponse.json({ id: result.insertedId.toString(), ...rsvp }, { status: 201 });
  } catch (error) {
    console.error("Could not save RSVP", error);
    return NextResponse.json({ error: "Không thể lưu phản hồi lúc này" }, { status: 500 });
  }
}
