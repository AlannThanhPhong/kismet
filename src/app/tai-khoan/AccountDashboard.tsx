"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type AccountUser = { id: string; email: string; name: string; role: "user" | "admin"; isAdmin: boolean };
type Trial = {
  id: string;
  templateCode: string;
  title?: string;
  ownerEmail?: string | null;
  createdAt: string;
  expiresAt: string | null;
  status: "active" | "expired" | "disabled";
  daysRemaining: number;
  renewalCount?: number;
};

const dateText = (value: string | null) => value
  ? new Date(value).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })
  : "Không xác định";

export default function AccountDashboard() {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [myTrials, setMyTrials] = useState<Trial[]>([]);
  const [adminTrials, setAdminTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);

  const loadAccount = useCallback(async () => {
    setLoading(true);
    try {
      const authResponse = await fetch("/api/auth/me", { cache: "no-store" });
      const authData = await authResponse.json() as { user?: AccountUser | null; error?: string };
      if (!authResponse.ok || !authData.user) {
        setUser(null);
        setMyTrials([]);
        setAdminTrials([]);
        if (authData.error) setFormError(authData.error);
        return;
      }

      setUser(authData.user);
      const listResponse = await fetch("/api/account/trials", { cache: "no-store" });
      const listData = await listResponse.json() as { trials?: Trial[]; error?: string };
      if (!listResponse.ok) throw new Error(listData.error || "Chưa thể tải thiệp của bạn.");
      setMyTrials(listData.trials || []);

      if (authData.user.isAdmin) {
        const adminResponse = await fetch("/api/admin/published-trials", { cache: "no-store" });
        const adminData = await adminResponse.json() as { trials?: Trial[]; error?: string };
        if (!adminResponse.ok) throw new Error(adminData.error || "Chưa thể tải danh sách quản trị.");
        setAdminTrials(adminData.trials || []);
      } else {
        setAdminTrials([]);
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Chưa thể tải tài khoản.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadAccount(); }, [loadAccount]);
  useEffect(() => {
    const authError = new URLSearchParams(window.location.search).get("authError");
    const messages: Record<string, string> = {
      google_not_configured: "Đăng nhập Google chưa được cấu hình. Vui lòng thử lại sau.",
      google_denied: "Bạn đã hủy đăng nhập Google.",
      google_invalid_response: "Phản hồi đăng nhập Google không hợp lệ. Vui lòng thử lại.",
      google_unverified_email: "Google chưa xác minh địa chỉ email của tài khoản này.",
      google_account_conflict: "Email Google này đã được liên kết với một tài khoản khác.",
      google_failed: "Chưa thể đăng nhập bằng Google. Vui lòng thử lại.",
    };
    if (authError) setFormError(messages[authError] || messages.google_failed);
  }, []);
  useEffect(() => {
    const timer = window.setInterval(() => setRefreshTick((value) => value + 1), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const returnPath = useMemo(() => {
    if (typeof window === "undefined") return null;
    const next = new URLSearchParams(window.location.search).get("next");
    return next && next.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : null;
  }, [loading]);
  const googleLoginHref = returnPath
    ? `/api/auth/google?next=${encodeURIComponent(returnPath)}`
    : "/api/auth/google";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    setUser(null);
    setMyTrials([]);
    setAdminTrials([]);
    setNotice("Bạn đã đăng xuất.");
  };

  const sharePath = (trial: Trial) => `/thiep/${encodeURIComponent(trial.templateCode)}?custom=${encodeURIComponent(trial.id)}`;
  const currentDays = (trial: Trial) => {
    if (!trial.expiresAt) return 0;
    return Math.max(0, Math.ceil((new Date(trial.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
  };

  void refreshTick;

  return (
    <main className="account-page">
      <div className="account-shell">
        <header className="account-topbar">
          <Link className="account-brand" href="/">kIsmet <span>love</span></Link>
          <nav className="account-topbar-links" aria-label="Điều hướng tài khoản">
            {user?.isAdmin && <Link className="account-admin-open" href="/quan-ly-thiep">Quản lý thiệp</Link>}
            <Link className="account-back" href="/tao-thiep">Về phòng tạo thiệp</Link>
          </nav>
        </header>

        {loading ? <section className="account-panel account-loading">Đang tải tài khoản…</section> : user ? (
          <>
            <section className="account-panel account-welcome">
              <div>
                <p className="account-eyebrow">TÀI KHOẢN CỦA BẠN</p>
                <h1>Xin chào, {user.name}</h1>
                <p>{user.email}{user.isAdmin && <span className="account-admin-badge">Quản trị viên</span>}</p>
              </div>
              <button type="button" className="account-quiet-button" onClick={handleLogout}>Đăng xuất</button>
            </section>

            {notice && <p className="account-notice" role="status">{notice}</p>}
            {formError && <p className="account-error" role="alert">{formError}</p>}

            <section className="account-section">
              <div className="account-section-heading">
                <div><p className="account-eyebrow">THƯ VIỆN RIÊNG</p><h2>Thiệp bạn đã tạo</h2></div>
                <span>{myTrials.length} thiệp</span>
              </div>
              {myTrials.length ? <div className="account-trial-grid">
                {myTrials.map((trial) => {
                  const days = currentDays(trial);
                  const active = trial.status === "active";
                  const disabled = trial.status === "disabled";
                  return <article className={`account-trial-card ${active ? "" : disabled ? "is-disabled" : "is-expired"}`} key={trial.id}>
                    <div className="account-trial-card-top">
                      <span className={`account-status ${active ? "is-active" : disabled ? "is-disabled" : "is-expired"}`}>{active ? `Còn ${days} ngày` : disabled ? "Đang vô hiệu hóa" : "Đã hết hạn"}</span>
                      <span className="account-trial-code">{trial.templateCode}</span>
                    </div>
                    <h3>{trial.title || trial.templateCode}</h3>
                    <dl>
                      <div><dt>Tài khoản tạo</dt><dd>{user.email}</dd></div>
                      <div><dt>Tạo lúc</dt><dd>{dateText(trial.createdAt)}</dd></div>
                      <div><dt>Hết hạn</dt><dd>{dateText(trial.expiresAt)}</dd></div>
                    </dl>
                    <div className="account-card-actions">
                      {active
                        ? <Link className="account-primary-button" href={sharePath(trial)} target="_blank" rel="noopener noreferrer">Mở thiệp</Link>
                        : <span className="account-disabled-button">{disabled ? "Thiệp đang tạm khóa" : "Thiệp đã hết hạn"}</span>}
                    </div>
                  </article>;
                })}
              </div> : <div className="account-empty"><p>Bạn chưa xuất bản thiệp nào.</p><Link href="/tao-thiep">Thử một mẫu thiệp</Link></div>}
            </section>

            {user.isAdmin && <section className="account-section account-admin-section">
              <div className="account-section-heading">
                <div><p className="account-eyebrow">QUẢN TRỊ</p><h2>Thiệp của mọi tài khoản</h2><Link className="account-admin-open" href="/quan-ly-thiep">Mở trang quản lý thiệp</Link></div>
                <span>{adminTrials.length} thiệp</span>
              </div>
              {adminTrials.length ? <div className="account-admin-list">
                {adminTrials.map((trial) => {
                  const days = currentDays(trial);
                  const active = trial.status === "active";
                  const disabled = trial.status === "disabled";
                  return <article className="account-admin-row" key={trial.id}>
                    <div className="account-admin-row-main">
                      <strong>{trial.title || trial.templateCode}</strong>
                      <span>{trial.ownerEmail || "Bản cũ chưa gắn tài khoản"} · {trial.templateCode}</span>
                      <small>Tạo {dateText(trial.createdAt)} · Hết hạn {dateText(trial.expiresAt)}</small>
                    </div>
                    <div className="account-admin-row-actions">
                      <span className={`account-status ${active ? "is-active" : disabled ? "is-disabled" : "is-expired"}`}>{active ? `Còn ${days} ngày` : disabled ? "Đang vô hiệu hóa" : "Đã hết hạn"}</span>
                      {active && <Link className="account-primary-button admin-trial-view" href={sharePath(trial)} target="_blank" rel="noopener noreferrer">Mở xem thiệp</Link>}
                    </div>
                  </article>;
                })}
              </div> : <div className="account-empty"><p>Chưa có bản thiệp nào được xuất bản.</p></div>}
            </section>}
          </>
        ) : (
          <section className="account-panel account-auth-panel">
            <div className="account-auth-intro">
              <p className="account-eyebrow">LƯU LẠI CÂU CHUYỆN CỦA BẠN</p>
              <h1>Đăng nhập tài khoản</h1>
              <p>Tiếp tục bằng Google để xuất bản thiệp, xem những mẫu bạn đã tạo và theo dõi ngày hết hạn.</p>
            </div>
            <div className="account-form">
              {formError && <p className="account-error" role="alert">{formError}</p>}
              <Link className="account-primary-button account-submit account-google-button" href={googleLoginHref}>
                <span aria-hidden="true">G</span> Tiếp tục với Google
              </Link>
              <p className="account-form-hint">Lần đầu đăng nhập, tài khoản sẽ được tạo tự động bằng Google.</p>
            </div>
            <p className="account-expiry-note">Mỗi thiệp đã xuất bản có thời hạn. Quản trị viên có thể chọn số ngày gia hạn hoặc tạm vô hiệu hóa thiệp.</p>
          </section>
        )}
      </div>
    </main>
  );
}
