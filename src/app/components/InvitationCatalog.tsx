"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

type InvitationSummary = {
  code: string;
  slug: string;
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
        if (!response.ok) throw new Error("Không thể tải danh sách thiệp.");
        const data: InvitationSummary[] = await response.json();
        if (!Array.isArray(data)) throw new Error("Danh sách thiệp không hợp lệ.");
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
    <section className="invitation-catalog" id="danh-sach-thiep">
      <div className="invitation-catalog-heading">
        <div>
          <div className="section-kicker">NHỮNG NGÀY VUI ĐANG ĐƯỢC KỂ</div>
          <h2>Thiệp cưới <em>của chúng mình.</em></h2>
        </div>
        <span>{!loaded ? "…" : failed ? "—" : items.length.toString().padStart(2, "0")} THIỆP</span>
      </div>
      {items.length ? (
        <>
        {!databaseConnected && <p className="invitation-catalog-empty">Bạn đang xem thiệp mẫu.</p>}
        <div className="invitation-catalog-grid">
          {items.map((item) => (
            <a className="invitation-list-card" href={`/thiep/${encodeURIComponent(item.code)}`} key={item.code}>
              <div className={`invitation-list-image${item.code === "20260110-NHVVAM" ? " invitation-list-image-full" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.coverImage ?? "/wedding-invitations/20261027-KHVT/images/0V7A7519-800.webp"} alt={`Thiệp cưới ${item.couple.partnerOne} và ${item.couple.partnerTwo}`} />
                <span className="invitation-card-arrow"><ArrowRight size={17} /></span>
              </div>
              <div className="invitation-list-caption">
                <div><span>MÃ THIỆP · {item.code}</span><h3>{item.couple.partnerOne} <i>&</i> {item.couple.partnerTwo}</h3></div>
                <time dateTime={item.event.date}>{new Date(item.event.date).toLocaleDateString("vi-VN")}</time>
              </div>
            </a>
          ))}
        </div>
        </>
      ) : (
        <p className="invitation-catalog-empty">
          {!loaded ? "Đang tải những tấm thiệp…" : failed ? "Chưa tải được danh sách thiệp. Bạn thử lại nhé." : "Chưa có thiệp nào."}
          {failed && <button type="button" className="invitation-retry" onClick={() => void loadInvitations()}>Tải lại</button>}
        </p>
      )}
    </section>
  );
}
