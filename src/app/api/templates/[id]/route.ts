import { NextRequest, NextResponse } from "next/server";
import { currencyForCountry } from "@/lib/pricing";
import { getVisitorCountry } from "@/lib/visitor-country";
import { getCatalog } from "@/lib/storefront-catalog";
import { initialLayers } from "@/app/components/InvitationArtwork";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getCatalog(currencyForCountry(await getVisitorCountry())).find(item => item.id === id);
  if (!item) return NextResponse.json({ error: "Không tìm thấy mẫu thiệp." }, { status: 404 });
  return NextResponse.json({ item, layers: item.template ? [] : initialLayers(item), fonts: ["serif", "sans", "script"], suiteId: item.id }, { headers: { "Cache-Control": "private, no-store" } });
}
