import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { Invitation, Rsvp } from "@/lib/models";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON không hợp lệ." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Thông tin phản hồi không hợp lệ." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const guestName = typeof input.guestName === "string" ? input.guestName.trim() : "";
  const attending = input.attending;
  const guestCount = input.guestCount === undefined ? 1 : input.guestCount;
  const message = typeof input.message === "string" ? input.message.trim() : undefined;

  if (!guestName || guestName.length > 120 || typeof attending !== "boolean" ||
      !Number.isInteger(guestCount) || (guestCount as number) < 1 || (guestCount as number) > 20 ||
      (message?.length ?? 0) > 1000) {
    return NextResponse.json({ error: "Tên khách, xác nhận tham dự hoặc số lượng khách không hợp lệ." }, { status: 400 });
  }

  try {
    const { slug } = await params;
    const db = await getDatabase();
    const invitation = await db.collection<Invitation>("invitations").findOne({ slug });
    if (!invitation) return NextResponse.json({ error: "Không tìm thấy thiệp." }, { status: 404 });

    const rsvp: Omit<Rsvp, "_id"> = {
      invitationId: invitation._id,
      guestName,
      attending,
      guestCount: attending ? guestCount as number : 0,
      ...(message ? { message } : {}),
      createdAt: new Date(),
    };
    const result = await db.collection<Omit<Rsvp, "_id">>("rsvps").insertOne(rsvp);
    return NextResponse.json({ id: result.insertedId.toString(), ...rsvp }, { status: 201 });
  } catch (error) {
    console.error("Could not save RSVP", error);
    return NextResponse.json({ error: "Không thể lưu phản hồi lúc này." }, { status: 500 });
  }
}
