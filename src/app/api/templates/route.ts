import { NextRequest, NextResponse } from "next/server";
import { filterCatalog, getCatalog, PACKAGES } from "@/lib/storefront-catalog";
import { currencyForCountry } from "@/lib/pricing";
import { getVisitorCountry } from "@/lib/visitor-country";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const currency = currencyForCountry(await getVisitorCountry());
  const items = filterCatalog(getCatalog(currency), params);
  const page = Math.floor(Math.max(1, Math.min(1000, Number(params.get("page")) || 1)));
  const size = Math.floor(Math.max(1, Math.min(24, Number(params.get("limit")) || 9)));
  return NextResponse.json({ categories: PACKAGES, items: items.slice((page - 1) * size, page * size), total: items.length, page, currency }, { headers: { "Cache-Control": "private, no-store" } });
}
