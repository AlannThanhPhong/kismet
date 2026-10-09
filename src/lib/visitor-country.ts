import "server-only";
import { isIP } from "node:net";
import { headers } from "next/headers";

function countryCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const code = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) && code !== "XX" ? code : null;
}

export async function getVisitorCountry(): Promise<string | null> {
  const requestHeaders = await headers();

  // These headers must be set/overwritten by the hosting platform or trusted proxy.
  for (const name of ["x-vercel-ip-country", "cf-ipcountry"]) {
    const value = requestHeaders.get(name);
    if (value) return countryCode(value);
  }

  const forwardedIp = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = requestHeaders.get("cf-connecting-ip")?.trim()
    || forwardedIp
    || requestHeaders.get("x-real-ip")?.trim();

  // Never query the server's own IP when the visitor's address is unavailable.
  if (!ip || !isIP(ip) || /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|0\.|::1$|::$|f[cd]|fe[89ab])/i.test(ip)) {
    return null;
  }

  try {
    const response = await fetch(`https://api.country.is/${encodeURIComponent(ip)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) return null;
    const result: unknown = await response.json();
    return result && typeof result === "object" && "country" in result
      ? countryCode(result.country)
      : null;
  } catch {
    return null;
  }
}
