import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { isSafeReturnPath } from "@/lib/user-auth";

export const runtime = "nodejs";

const STATE_COOKIE = "kismet-google-state";
const VERIFIER_COOKIE = "kismet-google-verifier";
const NEXT_COOKIE = "kismet-google-next";
const TEMP_COOKIE_PATH = "/api/auth/google";

function tempCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: TEMP_COOKIE_PATH,
    maxAge: 10 * 60,
  };
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/tai-khoan?authError=google_not_configured", request.url));
  }

  const redirectUri = process.env.GOOGLE_REDIRECT_URI?.trim()
    || new URL("/api/auth/google/callback", request.url).toString();
  const state = randomBytes(32).toString("hex");
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();

  const response = NextResponse.redirect(authUrl);
  const cookieOptions = tempCookieOptions();
  const next = request.nextUrl.searchParams.get("next");
  response.cookies.set(STATE_COOKIE, state, cookieOptions);
  response.cookies.set(VERIFIER_COOKIE, verifier, cookieOptions);
  response.cookies.set(NEXT_COOKIE, isSafeReturnPath(next) ? next : "", cookieOptions);
  return response;
}
