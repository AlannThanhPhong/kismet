import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const headers = { "Cache-Control": "private, no-store" };
  if (!process.env.MONGODB_URI) return NextResponse.json({ reviews: [] }, { headers });
  const stars = Number(request.nextUrl.searchParams.get("stars"));
  try {
    const db = await getDatabase();
    const records = await db.collection("reviews").find({ approved: true, ...(stars >= 1 && stars <= 5 && Number.isInteger(stars) ? { rating: stars } : {}) }, { projection: { name: 1, text: 1, rating: 1, templateName: 1 } }).sort({ createdAt: -1 }).limit(12).toArray();
    const reviews = records.filter(record => typeof record.name === "string" && typeof record.text === "string" && Number.isInteger(record.rating) && record.rating >= 1 && record.rating <= 5).map(record => ({ id: record._id.toString(), name: record.name, text: record.text, rating: record.rating, templateName: typeof record.templateName === "string" ? record.templateName : "" }));
    return NextResponse.json({ reviews }, { headers });
  } catch { return NextResponse.json({ error: "Chưa thể tải đánh giá lúc này." }, { status: 503, headers }); }
}
