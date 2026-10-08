import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";
import type { Invitation } from "@/lib/models";
import "./invitation.css";

const firstInvitation = {
  code: "20261027-KHVT",
  couple: { partnerOne: "Kim Hiên", partnerTwo: "Văn Tài" },
  event: { date: "2026-10-27T02:00:00.000Z", venue: "Tư gia nhà gái", address: "Tổ 10, ấp Tân Đông 1, xã Tân Lập" },
};

type Props = { params: Promise<{ code: string }> };

async function findInvitation(code: string) {
  if (code === firstInvitation.code) return firstInvitation;
  try {
    const db = await getDatabase();
    return db.collection<Invitation>("invitations").findOne({ code });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const invitation = await findInvitation(code);
  if (!invitation) return { title: "Không tìm thấy thiệp cưới" };
  return { title: `${invitation.couple.partnerOne} & ${invitation.couple.partnerTwo} | Thiệp cưới` };
}

export default async function InvitationPage({ params }: Props) {
  const { code } = await params;
  const invitation = await findInvitation(code);
  if (!invitation) notFound();

  if (code === firstInvitation.code) {
    return <iframe className="full-invitation" src={`/wedding-invitations/${code}/index.html`} title={`Thiệp cưới ${invitation.couple.partnerOne} và ${invitation.couple.partnerTwo}`} />;
  }

  const date = new Date(invitation.event.date);
  return (
    <main className="invitation-fallback">
      <Link className="invitation-back" href="/#danh-sach-thiep">← Tất cả thiệp</Link>
      <section className="invitation-fallback-card">
        <span className="section-kicker">MỘT NGÀY ĐẶC BIỆT · MỘT ĐỜI BÊN NHAU</span>
        <p className="invitation-fallback-script">Trân trọng kính mời</p>
        <h1>{invitation.couple.partnerOne}<i>&</i>{invitation.couple.partnerTwo}</h1>
        <span className="invitation-fallback-rule">✳</span>
        <p>{date.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        <p>{invitation.event.venue}{invitation.event.address ? ` · ${invitation.event.address}` : ""}</p>
        <span className="invitation-fallback-code">MÃ THIỆP · {invitation.code}</span>
      </section>
    </main>
  );
}
