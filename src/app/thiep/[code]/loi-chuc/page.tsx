import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { guestbookCode, hasGuestbookAccess } from "@/lib/guestbook-access";
import Guestbook from "./Guestbook";
import "./guestbook.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sổ lưu bút · Thanh Điền & Ngọc Dung", robots: { index: false, follow: false } };

export default async function GuestbookPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (code !== guestbookCode) notFound();
  let unlocked = false;
  try { unlocked = await hasGuestbookAccess(code, (await cookies()).toString()); } catch { /* Login remains available. */ }
  return <Guestbook initiallyUnlocked={unlocked} />;
}
