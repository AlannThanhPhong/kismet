import { createHash, randomBytes } from "node:crypto";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";

export const USER_SESSION_COOKIE = "kismet-account-session";
export const USER_SESSION_SECONDS = 30 * 24 * 60 * 60;
export const ADMIN_EMAIL = "kismetlove.invitation@gmail.com";

type UserRole = "user" | "admin";
type UserDocument = {
  _id: ObjectId;
  email: string;
  name: string;
  googleSub?: string;
  role: UserRole;
  createdAt: Date;
};
type SessionDocument = { tokenHash: string; userId: string; provider?: "google"; expiresAt: Date };

export type AuthUser = { id: string; email: string; name: string; role: UserRole; isAdmin: boolean };

let indexesPromise: Promise<void> | null = null;

export async function ensureUserAuthIndexes() {
  if (!indexesPromise) {
    indexesPromise = (async () => {
      const db = await getDatabase();
      await Promise.all([
        db.collection<UserDocument>("users").createIndex({ email: 1 }, { unique: true }),
        db.collection<UserDocument>("users").createIndex({ googleSub: 1 }, { unique: true, sparse: true }),
        db.collection<SessionDocument>("user_sessions").createIndex({ tokenHash: 1 }, { unique: true }),
        db.collection<SessionDocument>("user_sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      ]);
    })().catch((error) => {
      indexesPromise = null;
      throw error;
    });
  }
  await indexesPromise;
}

export function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isSafeReturnPath(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\");
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createUserSession(userId: string) {
  await ensureUserAuthIndexes();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + USER_SESSION_SECONDS * 1000);
  const db = await getDatabase();
  await db.collection<SessionDocument>("user_sessions").insertOne({
    tokenHash: hashSessionToken(token),
    userId,
    provider: "google",
    expiresAt,
  });
  return { token, expiresAt };
}

export function getSessionToken(request: Request) {
  const cookies = request.headers.get("cookie") || "";
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${USER_SESSION_COOKIE}=([a-f0-9]{64})(?:;|$)`));
  return match?.[1] ?? null;
}

export async function getAuthUser(request: Request): Promise<AuthUser | null> {
  const token = getSessionToken(request);
  if (!token) return null;
  await ensureUserAuthIndexes();
  const db = await getDatabase();
  const session = await db.collection<SessionDocument>("user_sessions").findOne({
    tokenHash: hashSessionToken(token),
    provider: "google",
    expiresAt: { $gt: new Date() },
  });
  if (!session || !ObjectId.isValid(session.userId)) return null;
  const user = await db.collection<UserDocument>("users").findOne({ _id: new ObjectId(session.userId) });
  if (!user || !user.googleSub) return null;
  const email = normalizeEmail(user.email);
  const isAdmin = email === ADMIN_EMAIL;
  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    role: isAdmin ? "admin" : "user",
    isAdmin,
  };
}

export async function deleteUserSession(request: Request) {
  const token = getSessionToken(request);
  if (!token) return;
  await ensureUserAuthIndexes();
  const db = await getDatabase();
  await db.collection<SessionDocument>("user_sessions").deleteOne({ tokenHash: hashSessionToken(token) });
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  return Boolean(origin && origin === new URL(request.url).origin);
}
