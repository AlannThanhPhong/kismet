"use client";
import { useEffect, useState } from "react";

type Entry = { id: string; guestName: string; attending: boolean; guestCount: number; message: string; createdAt: string; updatedAt: string };
type Summary = { responses: number; guests: number; wishCount: number; attending?: number; declined?: number; entries?: Entry[];
  wishes: { id: string; guestName: string; message: string; createdAt: string }[] };
const api = "/api/invitations/20260823-NDTD";

export default function Guestbook({ initiallyUnlocked }: { initiallyUnlocked: boolean }) {
  const [unlocked, setUnlocked] = useState(initiallyUnlocked);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [revision, setRevision] = useState(0);
  const [tab, setTab] = useState<"responses" | "wishes">("responses");
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState("all");
  const entries = (summary?.entries ?? []).filter(entry =>
    (attendance === "all" || entry.attending === (attendance === "yes")) &&
    `${entry.guestName} ${entry.message}`.toLocaleLowerCase("vi-VN").includes(search.trim().toLocaleLowerCase("vi-VN")));
  const formatTime = (date: string) => new Date(date).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  useEffect(() => {
    if (!unlocked) return;
    let disposed = false;
    let stream: EventSource | undefined;
    const controller = new AbortController();
    const lock = () => { setUnlocked(false); setSummary(null); setStatus("Phiên xem đã kết thúc. Vui lòng nhập lại mật khẩu."); };
    const refresh = async () => {
      try {
        const response = await fetch(`${api}/rsvps/summary`, { cache: "no-store", signal: controller.signal });
        if (disposed) return;
        if (response.status === 401) { lock(); return; }
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (!disposed) { setSummary(data); setStatus(""); }
      } catch { if (!disposed) setStatus("Chưa tải được lời chúc. Bạn thử cập nhật nhé."); }
    };
    const connect = () => {
      if (document.hidden || stream || disposed || !window.EventSource) return;
      stream = new EventSource(`${api}/rsvps/stream`);
      stream.onmessage = event => { try { setSummary(JSON.parse(event.data)); setStatus(""); } catch { setStatus("Chưa đọc được lời chúc mới."); } };
      stream.onerror = () => { setStatus("Đang kết nối lại sổ lưu bút…"); void refresh(); };
      stream.addEventListener("locked", lock);
      stream.addEventListener("unavailable", () => { stream?.close(); stream = undefined; setStatus("Chưa kết nối được sổ lưu bút. Bạn thử cập nhật nhé."); });
    };
    const visibility = () => {
      if (document.hidden) { stream?.close(); stream = undefined; }
      else { void refresh(); connect(); }
    };
    void refresh(); connect();
    document.addEventListener("visibilitychange", visibility);
    return () => { disposed = true; controller.abort(); stream?.close(); document.removeEventListener("visibilitychange", visibility); };
  }, [unlocked, revision]);

  return <main className="private-guestbook">
    <a className="guestbook-back" href="/thiep/20260823-NDTD" onClick={event => {
      if (window.parent !== window && new URLSearchParams(window.location.search).get("embedded") === "1") {
        event.preventDefault();
        window.parent.postMessage({ type: "kismet:close-guestbook" }, window.location.origin);
      }
    }}>← Về thiệp cưới</a>
    <header><p className="guestbook-kicker">LOVE NOTES</p><h1>Những lời chúc <em>ở lại.</em></h1><p>Thanh Điền & Ngọc Dung · 23.08.2026</p></header>
    {!unlocked ? <form className="guestbook-login" onSubmit={async event => {
      event.preventDefault(); if (busy) return; setBusy(true); setStatus("");
      try {
        const response = await fetch(`${api}/guestbook-access`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setPassword(""); setUnlocked(true);
      } catch (error) { setStatus(error instanceof Error ? error.message : "Chưa mở được sổ lưu bút."); }
      finally { setBusy(false); }
    }}><label htmlFor="guestbook-password">Nhập mật khẩu để mở sổ lưu bút</label><input id="guestbook-password" type="password" autoComplete="current-password" required maxLength={128} value={password} onChange={event => setPassword(event.target.value)} /><button disabled={busy}>{busy ? "Đang mở…" : "Mở sổ lưu bút"}</button></form> : <>
      {summary && <>
        <div className="guestbook-totals"><p><strong>{summary.responses}</strong>phản hồi</p><p><strong>{summary.guests}</strong>khách tham dự</p><p><strong>{summary.wishCount}</strong>lời chúc</p></div>
        <nav className="guestbook-tabs" aria-label="Nội dung sổ lưu bút"><button aria-pressed={tab === "responses"} onClick={() => setTab("responses")}>Danh sách xác nhận ({summary.responses})</button><button aria-pressed={tab === "wishes"} onClick={() => setTab("wishes")}>Lời chúc ({summary.wishCount})</button></nav>
        {tab === "responses" ? <section aria-labelledby="responses-title" className="guestbook-responses">
          <h2 id="responses-title">Danh sách người xác nhận</h2>
          <p>{summary.attending ?? 0} người xác nhận tham dự · {summary.declined ?? 0} người không thể đến</p>
          <div className="guestbook-filters"><label>Tìm tên hoặc lời chúc<input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Nhập tên khách…" /></label><label>Trạng thái<select value={attendance} onChange={event => setAttendance(event.target.value)}><option value="all">Tất cả phản hồi</option><option value="yes">Sẽ tham dự</option><option value="no">Không thể đến</option></select></label></div>
          <p className="guestbook-list-count">Hiển thị {entries.length} / {summary.responses} phản hồi. Số khách bao gồm người gửi xác nhận.</p>
          {entries.length ? <table className="guestbook-table"><thead><tr><th scope="col">Tên khách</th><th scope="col">Xác nhận</th><th scope="col">Số khách</th><th scope="col">Chi tiết</th></tr></thead><tbody>{entries.map(entry => <tr key={entry.id}>
            <td data-label="Tên khách">{entry.guestName}</td><td data-label="Xác nhận"><span className={`attendance-badge ${entry.attending ? "attending" : "declined"}`}>{entry.attending ? "Sẽ tham dự" : "Không thể đến"}</span></td><td data-label="Số khách">{entry.guestCount}</td>
            <td data-label="Chi tiết"><details><summary>Xem lời chúc & thông tin</summary><div className="response-detail"><p className="response-message">{entry.message || "Chưa gửi lời chúc."}</p><p>Đi cùng: {entry.attending ? Math.max(0, entry.guestCount - 1) : 0} người</p><p>Gửi lúc: <time dateTime={entry.createdAt}>{formatTime(entry.createdAt)}</time></p><p>Cập nhật: <time dateTime={entry.updatedAt}>{formatTime(entry.updatedAt)}</time></p></div></details></td>
          </tr>)}</tbody></table> : <p className="guestbook-empty">{summary.responses ? "Không có phản hồi phù hợp bộ lọc." : "Chưa có ai gửi xác nhận tham dự."}</p>}
        </section> : <section aria-label="Lời chúc"><p className="guestbook-empty">{summary.wishCount ? "Những lời thương gửi đến hai chúng mình." : "Hãy gửi lời chúc đầu tiên cho chúng mình ♡"}</p><div className="guestbook-grid">{summary.wishes.map(wish => <article key={wish.id}><blockquote>{wish.message}</blockquote><p>{wish.guestName}</p><time dateTime={wish.createdAt}>{formatTime(wish.createdAt)}</time></article>)}</div></section>}
      </>}
      <div className="guestbook-actions"><button onClick={() => setRevision(value => value + 1)}>Cập nhật danh sách & lời chúc ↻</button><button disabled={busy} onClick={async () => {
        setBusy(true);
        try {
          const response = await fetch(`${api}/guestbook-access`, { method: "DELETE" });
          if (!response.ok) throw new Error();
          setUnlocked(false); setSummary(null); setStatus("");
        } catch { setStatus("Chưa khóa được sổ lưu bút. Bạn thử lại nhé."); }
        finally { setBusy(false); }
      }}>Khóa sổ lưu bút</button></div>
    </>}
    <p role="status" aria-live="polite">{status}</p>
  </main>;
}
