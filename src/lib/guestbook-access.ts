import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { getDatabase } from "@/lib/mongodb";

export const guestbookCode = "20260823-NDTD";
export const guestbookCookie = "kismet-ntdt-guestbook";
export const guestbookSessionSeconds = 8 * 60 * 60;
const passwordHash = "2859c069c67869d44c6b615ba737a1a025fdac5513710c1fc9ec4949efbd4d90";
type Session = { tokenHash: string; slug: string; expiresAt: Date };
const hash = (value: string) => createHash("sha256").update(value).digest("hex");

export function checkGuestbookPassword(password: unknown) {
  return typeof password === "string" && password.length <= 128 &&
    timingSafeEqual(Buffer.from(hash(password), "hex"), Buffer.from(passwordHash, "hex"));
}
export async function createGuestbookSession() {
  const db = await getDatabase();
  const sessions = db.collection<Session>("guestbookSessions");
  await sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  const token = randomBytes(32).toString("hex");
  await sessions.insertOne({ tokenHash: hash(token), slug: guestbookCode,
    expiresAt: new Date(Date.now() + guestbookSessionSeconds * 1000) });
  return token;
}
export async function hasGuestbookAccess(slug: string, cookieHeader: string) {
  if (slug !== guestbookCode) return true;
  const token = cookieHeader.split(";").map(part => part.trim()).find(part => part.startsWith(`${guestbookCookie}=`))?.slice(guestbookCookie.length + 1);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
  const db = await getDatabase();
  return Boolean(await db.collection<Session>("guestbookSessions").findOne({
    tokenHash: hash(token), slug, expiresAt: { $gt: new Date() },
  }));
}
export async function revokeGuestbookSession(token?: string) {
  if (!token) return;
  const db = await getDatabase();
  await db.collection<Session>("guestbookSessions").deleteOne({ tokenHash: hash(token), slug: guestbookCode });
}
