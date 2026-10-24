import { timingSafeEqual } from "node:crypto";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import {
  ADMIN_EMAIL,
  createUserSession,
  ensureUserAuthIndexes,
  isSafeReturnPath,
  normalizeEmail,
  USER_SESSION_COOKIE,
  USER_SESSION_SECONDS,
} from "@/lib/user-auth";

export const runtime = "nodejs";

const STATE_COOKIE = "kismet-google-state";
const VERIFIER_COOKIE = "kismet-google-verifier";
const NEXT_COOKIE = "kismet-google-next";
const TEMP_COOKIE_PATH = "/api/auth/google";

type GoogleUserInfo = { sub?: unknown; email?: unknown; email_verified?: unknown; name?: unknown };
type UserDocument = {
  _id: ObjectId;
  email: string;
  name: string;
  googleSub?: string;
  role: "user" | "admin";
  createdAt: Date;
};

function safeStateMatch(received: string, expected: string) {
  const actualBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

function clearTemporaryCookies(response: NextResponse) {
  for (const name of [STATE_COOKIE, VERIFIER_COOKIE, NEXT_COOKIE]) {
    response.cookies.set(name, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: TEMP_COOKIE_PATH,
      maxAge: 0,
    });
  }
}

function accountRedirect(request: NextRequest, error: string) {
  const response = NextResponse.redirect(new URL(`/tai-khoan?authError=${encodeURIComponent(error)}`, request.url));
  clearTemporaryCookies(response);
  return response;
}

function validEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function saveGoogleUser(info: { sub: string; email: string; name: string }) {
  await ensureUserAuthIndexes();
  const db = await getDatabase();
  const users = db.collection<UserDocument>("users");
  const role = info.email === ADMIN_EMAIL ? "admin" : "user";
  const byGoogleId = await users.findOne({ googleSub: info.sub });

  if (byGoogleId) {
    await users.updateOne({ _id: byGoogleId._id }, { $set: { email: info.email, name: info.name, role } });
    return String(byGoogleId._id);
  }

  const byEmail = await users.findOne({ email: info.email });
  if (byEmail) {
    if (byEmail.googleSub && byEmail.googleSub !== info.sub) {
      throw new Error("EMAIL_ALREADY_LINKED");
    }
    await users.updateOne({ _id: byEmail._id }, { $set: { googleSub: info.sub, name: info.name, role } });
    return String(byEmail._id);
  }

  const user: UserDocument = {
    _id: new ObjectId(),
    email: info.email,
    name: info.name,
    googleSub: info.sub,
    role,
    createdAt: new Date(),
  };
  try {
    await users.insertOne(user);
    return String(user._id);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      const racedUser = await users.findOne({ googleSub: info.sub });
      if (racedUser) {
        await users.updateOne({ _id: racedUser._id }, { $set: { email: info.email, name: info.name, role } });
        return String(racedUser._id);
      }
    }
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  if (params.has("error")) return accountRedirect(request, "google_denied");

  const code = params.get("code");
  const returnedState = params.get("state") || "";
  const expectedState = request.cookies.get(STATE_COOKIE)?.value || "";
  const verifier = request.cookies.get(VERIFIER_COOKIE)?.value;
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const redirectUri = process.env.GOOGLE_REDIRECT_URI?.trim()
    || new URL("/api/auth/google/callback", request.url).toString();

  if (!code || !expectedState || !safeStateMatch(returnedState, expectedState) || !verifier) {
    return accountRedirect(request, "google_invalid_response");
  }
  if (!clientId || !clientSecret) return accountRedirect(request, "google_not_configured");

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code_verifier: verifier,
      }),
      cache: "no-store",
    });
    const tokenData = await tokenResponse.json() as { access_token?: unknown };
    if (!tokenResponse.ok || typeof tokenData.access_token !== "string") {
      return accountRedirect(request, "google_failed");
    }

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
      cache: "no-store",
    });
    const profile = await profileResponse.json() as GoogleUserInfo;
    if (!profileResponse.ok || typeof profile.sub !== "string" || !profile.sub
      || typeof profile.email !== "string" || profile.email_verified !== true) {
      return accountRedirect(request, "google_unverified_email");
    }

    const email = normalizeEmail(profile.email);
    if (!validEmail(email)) return accountRedirect(request, "google_unverified_email");
    const name = typeof profile.name === "string" && profile.name.trim()
      ? profile.name.trim().replace(/\s+/g, " ").slice(0, 100)
      : email;
    const userId = await saveGoogleUser({ sub: profile.sub, email, name });
    const session = await createUserSession(userId);
    const next = request.cookies.get(NEXT_COOKIE)?.value;
    const response = NextResponse.redirect(new URL(isSafeReturnPath(next) ? next : "/tai-khoan", request.url));
    response.cookies.set(USER_SESSION_COOKIE, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: USER_SESSION_SECONDS,
    });
    clearTemporaryCookies(response);
    return response;
  } catch (error) {
    const code = error instanceof Error && error.message === "EMAIL_ALREADY_LINKED"
      ? "google_account_conflict"
      : "google_failed";
    if (code === "google_failed") console.error("Google sign-in failed:", error instanceof Error ? error.message : "Unknown error");
    return accountRedirect(request, code);
  }
}
