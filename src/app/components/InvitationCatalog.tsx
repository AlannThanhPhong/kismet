"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Heart } from "lucide-react";

type InvitationSummary = {
  code: string;
  slug: string;
  displayTitle?: string;
  displayCouple?: string;
  couple: { partnerOne: string; partnerTwo: string };
  event: { date: string; venue: string };
  coverImage?: string;
};

export default function InvitationCatalog() {
  const [items, setItems] = useState<InvitationSummary[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [databaseConnected, setDatabaseConnected] = useState(true);

  const loadInvitations = useCallback(async () => {
    setLoaded(false);
    setFailed(false);
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch("/api/invitations", { cache: "no-store", signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error("Không thể tải danh sách thiệp");
        const data: InvitationSummary[] = await response.json();
        if (!Array.isArray(data)) throw new Error("Danh sách thiệp không hợp lệ");
        setDatabaseConnected(response.headers.get("X-MongoDB-Status") !== "unconfigured");
        setItems(data);
        setLoaded(true);
        return;
      } catch {
        if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
      }
    }
    setFailed(true);
    setLoaded(true);
  }, []);

  useEffect(() => { void loadInvitations(); }, [loadInvitations]);

  return (
    <section className="invitation-catalog section-wrap" id="danh-sach-thiep" aria-labelledby="catalog-title">
      <div className="invitation-catalog-heading" data-reveal>
        <div>
          <p className="section-kicker">01 / NHỮNG LỜI MỜI ĐÃ ĐƯỢC VIẾT</p>
          <h2 id="catalog-title">Hai người Một ngày<br /><em>Một chuyện tình để nhớ</em></h2>
        </div>
        <div className="catalog-aside"><p>Mỗi chiếc thiệp là một thế giới nhỏ<br />Mở ra, và ghé vào ngày vui của hai bạn</p><span>{!loaded ? "…" : failed ? "—" : items.length.toString().padStart(2, "0")} CHUYỆN TÌNH <Heart size={12} /></span></div>
      </div>
      {items.length ? (
        <>
        {!databaseConnected && <p className="invitation-catalog-empty">Bạn đang xem thiệp mẫu</p>}
        <div className="invitation-catalog-grid">
          {items.map((item, index) => (
            <a className="invitation-list-card" href={`/thiep/${encodeURIComponent(item.code)}`} key={item.code}>
              <div className={`invitation-list-image${item.code === "20260110-NHVVAM" ? " invitation-list-image-full" : ""}`}>
                <Image src={item.coverImage ?? "/wedding-invitations/20261027-KHVT/images/0V7A7519-800.webp"} alt={`Thiệp cưới ${item.couple.partnerOne} và ${item.couple.partnerTwo}`} fill sizes="(max-width: 700px) 90vw, (max-width: 1200px) 45vw, 530px" unoptimized={Boolean(item.coverImage?.startsWith("http"))} />
                <span className="invitation-image-index">THE WEDDING STORIES / {(index + 1).toString().padStart(2, "0")}</span>
                <span className="invitation-card-arrow"><ArrowUpRight size={23} strokeWidth={1.25} /></span>
                <span className="invitation-open-label">MỞ LỜI MỜI</span>
              </div>
              <div className="invitation-list-caption">
                <div>
                  <span>{item.displayCouple ?? `${item.couple.partnerOne} & ${item.couple.partnerTwo}`}</span>
                  <h3>{item.displayTitle ?? item.code}</h3>
                </div>
                <time dateTime={item.event.date}>{new Date(item.event.date).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</time>
              </div>
            </a>
          ))}
        </div>
        </>
      ) : !loaded ? (
        <div className="catalog-loading" role="status"><span className="sr-only">Đang tải những tấm thiệp…</span><div /><div /></div>
      ) : (
        <p className="invitation-catalog-empty" role="status">
          {failed ? "Chưa tải được danh sách thiệp Bạn thử lại nhé" : "Chưa có thiệp nào"}
          {failed && <button type="button" className="invitation-retry" onClick={() => void loadInvitations()}>Tải lại</button>}
        </p>
      )}
    </section>
  );
}
