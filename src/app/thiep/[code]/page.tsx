import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";
import type { Invitation } from "@/lib/models";
import { designedInvitations } from "@/lib/designed-invitations";
import CustomizedInvitationFrame from "./CustomizedInvitationFrame";
import "./invitation.css";

type Props = { params: Promise<{ code: string }> };

function normalizeInvitationCode(rawCode: string) {
  const decoded = decodeURIComponent(rawCode);
  if (
    decoded === "lovers-diary" ||
    decoded === "Lover’s Diary" ||
    decoded === "Lover's Diary"
  ) {
    return "lovers-diary";
  }
  if (decoded === "Coquette" || decoded === "coquette") {
    return "coquette";
  }
  if (
    decoded === "korea-style" ||
    decoded === "korea style" ||
    decoded === "Korea Style" ||
    decoded === "KOREA STYLE"
  ) {
    return "korea-style";
  }
  if (
    decoded === "doodle-art" ||
    decoded === "Doodle Art" ||
    decoded === "doodle art" ||
    decoded === "DOODLE ART"
  ) {
    return "doodle-art";
  }
  return decoded;
}

async function findInvitation(rawCode: string) {
  const code = normalizeInvitationCode(rawCode);
  const designed = designedInvitations.find((item) => item.code === code);
  if (designed) return designed;
  try {
    const db = await getDatabase();
    return db.collection<Invitation>("invitations").findOne({ code });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code: rawCode } = await params;
  const code = normalizeInvitationCode(rawCode);
  const invitation = await findInvitation(code);
  if (!invitation) return { title: "Không tìm thấy thiệp cưới" };
  const title = `${invitation.couple.partnerOne} & ${invitation.couple.partnerTwo} | Thiệp cưới`;
  const canonical = `/thiep/${encodeURIComponent(code)}`;
  const design = designedInvitations.find((item) => item.code === code);
  return {
    title,
    description: `Trân trọng kính mời đến chung vui tại ${invitation.event.venue}.`,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      url: canonical,
      ...(design ? { images: [design.coverImage] } : {}),
    },
  };
}

export default async function InvitationPage({ params }: Props) {
  const { code: rawCode } = await params;
  const code = normalizeInvitationCode(rawCode);
  const invitation = await findInvitation(code);
  if (!invitation) notFound();

  if (designedInvitations.some((item) => item.code === code)) {
    const folder =
      code === "lovers-diary"
        ? "Lover%E2%80%99s%20Diary"
        : code === "french-style"
          ? "French%20Style"
          : code === "coquette"
            ? "Coquette"
            : code === "korea-style"
              ? "korea%20style"
              : code === "doodle-art"
                ? "Doodle%20Art"
                : code;
    const revision =
      code === "20260323-NDNL"
        ? "?v=20261023-collage-fix"
        : code === "20260823-NDTD"
          ? "?v=20261012-natural-smiley-directions"
          : code === "20261230-KHAG"
            ? "?v=20261013-chronicles-spacing"
            : code === "lovers-diary"
              ? "?v=20261022-lovers-diary-circle-audio"
              : code === "french-style"
                ? "?v=20261022-french-style-v5"
                : code === "coquette"
                  ? "?v=20261022-coquette-v4"
                  : code === "korea-style"
                    ? "?v=20261023-korea-v3"
                    : "";
    return (
      <CustomizedInvitationFrame
        code={code}
        src={`/wedding-invitations/${folder}/index.html${revision}`}
        title={`Thiệp cưới ${invitation.couple.partnerOne} và ${invitation.couple.partnerTwo}`}
      />
    );
  }

  const date = new Date(invitation.event.date);
  return (
    <main className="invitation-fallback">
      <Link className="invitation-back" href="/#kho-mau-thiep">← Tất cả thiệp</Link>
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
