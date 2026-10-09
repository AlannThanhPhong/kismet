import { MongoServerError } from "mongodb";
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { Invitation } from "@/lib/models";
import { designedInvitations } from "@/lib/designed-invitations";

export const runtime = "nodejs";

function initials(name: string) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "D").split(/\s+/)
    .filter(Boolean).map((part) => part[0].replace(/[^a-z0-9]/gi, "")).join("").toUpperCase();
}

function invitationCode(dateText: string, partnerOne: string, partnerTwo: string) {
  const datePart = dateText.slice(0, 10).replaceAll("-", "");
  return `${datePart}-${initials(partnerOne)}${initials(partnerTwo)}`;
}

export async function GET() {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(designedInvitations, { headers: { "X-MongoDB-Status": "unconfigured" } });
  }

  try {
    const db = await getDatabase();
    const invitations = db.collection<Invitation>("invitations");
    await invitations.createIndex({ code: 1 }, { unique: true, partialFilterExpression: { code: { $type: "string" } } });
    for (const design of designedInvitations) {
      await invitations.updateOne(
        { code: design.code },
        { $setOnInsert: {
          ...design,
          event: { ...design.event, date: new Date(design.event.date) },
          createdAt: new Date(), updatedAt: new Date(),
        } },
        { upsert: true },
      );
    }
    const items = await invitations.find({}, {
      projection: { code: 1, slug: 1, displayTitle: 1, displayCouple: 1, couple: 1, event: 1, template: 1, coverImage: 1, createdAt: 1 },
    }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(items.map(({ _id, ...item }) => {
      const design = designedInvitations.find((entry) => entry.code === item.code);
      return { ...item, ...(design ? { coverImage: design.coverImage, displayTitle: item.displayTitle ?? design.displayTitle, displayCouple: item.displayCouple ?? ("displayCouple" in design ? design.displayCouple : undefined) } : {}) };
    }));
  } catch (error) {
    console.error("Could not list invitations", error);
    return NextResponse.json({ error: "Không thể tải danh sách thiệp Hãy kiểm tra cấu hình MongoDB" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON không hợp lệ" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Dữ liệu thiệp không hợp lệ" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const couple = input.couple as Record<string, unknown> | undefined;
  const event = input.event as Record<string, unknown> | undefined;
  const partnerOne = typeof couple?.partnerOne === "string" ? couple.partnerOne.trim() : "";
  const partnerTwo = typeof couple?.partnerTwo === "string" ? couple.partnerTwo.trim() : "";
  const venue = typeof event?.venue === "string" ? event.venue.trim() : "";
  const date = typeof event?.date === "string" ? new Date(event.date) : new Date("");
  const address = typeof event?.address === "string" ? event.address.trim() : undefined;

  const dateText = typeof event?.date === "string" ? event.date : "";
  if (!/^\d{4}-\d{2}-\d{2}/.test(dateText) || !partnerOne || !partnerTwo || !venue || Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Cần tên hai người, ngày cưới hợp lệ và địa điểm" }, { status: 400 });
  }

  const code = invitationCode(dateText, partnerOne, partnerTwo);
  const slug = code;

  try {
    const db = await getDatabase();
    const invitations = db.collection<Invitation>("invitations");
    await invitations.createIndex({ code: 1 }, { unique: true, partialFilterExpression: { code: { $type: "string" } } });
    await invitations.createIndex({ slug: 1 }, { unique: true });
    const now = new Date();
    const invitation: Omit<Invitation, "_id"> = {
      code,
      slug,
      couple: { partnerOne, partnerTwo },
      event: { date, venue, ...(address ? { address } : {}) },
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.collection<Omit<Invitation, "_id">>("invitations").insertOne(invitation);
    return NextResponse.json({ id: result.insertedId.toString(), ...invitation }, { status: 201 });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json({ error: "Đường dẫn thiệp này đã được sử dụng" }, { status: 409 });
    }
    console.error("Could not create invitation", error);
    return NextResponse.json({ error: "Không thể tạo thiệp lúc này" }, { status: 500 });
  }
}
