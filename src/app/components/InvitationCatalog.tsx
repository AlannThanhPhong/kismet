"use client";

import { useEffect, useState } from "react";
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
  const [databaseConnected, setDatabaseConnected] = useState(true);

  useEffect(() => {
    fetch("/api/invitations")
      .then(async (response) => {
        if (!response.ok) throw new Error("Không thể tải danh sách thiệp.");
        setDatabaseConnected(response.headers.get("X-MongoDB-Status") !== "unconfigured");
        return response.json();
      })
      .then((data: InvitationSummary[]) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <section className="invitation-catalog" id="danh-sach-thiep">
      <div className="invitation-catalog-heading">
        <div>
          <div className="section-kicker">NHỮNG NGÀY VUI ĐANG ĐƯỢC KỂ</div>
          <h2>Thiệp cưới <em>của chúng mình.</em></h2>
        </div>
        <span>{items.length.toString().padStart(2, "0")} THIỆP</span>
      </div>
      {items.length ? (
        <>
        {!databaseConnected && <p className="invitation-catalog-empty">Đang hiển thị thiệp mẫu. Hãy cấu hình <code>MONGODB_URI</code> trong <code>.env.local</code> để lưu và tải danh sách từ MongoDB.</p>}
        <div className="invitation-catalog-grid">
          {items.map((item) => (
            <a className="invitation-list-card" href={`/thiep/${encodeURIComponent(item.code)}`} key={item.code}>
              <div className="invitation-list-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.coverImage ?? "/images/0V7A7519-800.webp"} alt={`Thiệp cưới ${item.couple.partnerOne} và ${item.couple.partnerTwo}`} />
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
          {loaded ? "Chưa có thiệp nào. Hãy kết nối MongoDB để bắt đầu bộ sưu tập." : "Đang tải những tấm thiệp…"}
        </p>
      )}
    </section>
  );
}
