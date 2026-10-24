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
  status: "active" | "expired";
  daysRemaining: number;
  renewalCount?: number;
};
type TrialFilter = "all" | "active" | "expired";

const formatDate = (value: string | null) => {
  if (!value) return "Không xác định";
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? date.toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" })
    : "Không xác định";
};

export default function AdminTrialsDashboard() {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyRenewal, setBusyRenewal] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<TrialFilter>("all");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setPageError("");
    try {
      const authResponse = await fetch("/api/auth/me", { cache: "no-store" });
      const authData = await authResponse.json() as { user?: AccountUser | null; error?: string };
      if (!authResponse.ok) throw new Error(authData.error || "Chưa thể kiểm tra tài khoản.");

      const currentUser = authData.user || null;
      setUser(currentUser);
      if (!currentUser?.isAdmin) {
        setTrials([]);
        return;
      }

      const response = await fetch("/api/admin/published-trials", { cache: "no-store" });
      const data = await response.json() as { trials?: Trial[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Chưa thể tải danh sách thiệp.");
      setTrials(data.trials || []);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Chưa thể tải trang quản lý thiệp.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  const renewTrial = async (trialId: string) => {
    setBusyRenewal(trialId);
    setPageError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/published-trials/${encodeURIComponent(trialId)}/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Gia hạn chưa thành công.");
      setNotice("Đã gia hạn thiệp thêm 7 ngày.");
      await loadDashboard();
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Gia hạn chưa thành công.");
    } finally {
      setBusyRenewal(null);
    }
  };

  const filteredTrials = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");
    return trials.filter((trial) => {
      const active = trial.expiresAt !== null && new Date(trial.expiresAt).getTime() > Date.now();
      if (filter === "active" && !active) return false;
      if (filter === "expired" && active) return false;
      if (!normalizedQuery) return true;
      return [trial.title, trial.templateCode, trial.ownerEmail]
        .some((value) => value?.toLocaleLowerCase("vi").includes(normalizedQuery));
    });
  }, [filter, query, trials]);

  const activeCount = trials.filter((trial) => trial.expiresAt !== null && new Date(trial.expiresAt).getTime() > Date.now()).length;
  const expiredCount = trials.length - activeCount;

  const invitationPath = (trial: Trial) => `/thiep/${encodeURIComponent(trial.templateCode)}?custom=${encodeURIComponent(trial.id)}`;

  return (
    <main className="account-page admin-management-page">
      <div className="account-shell">
        <header className="account-topbar">
          <Link className="account-brand" href="/">kIsmet <span>love</span></Link>
          <nav className="account-topbar-links" aria-label="Điều hướng quản trị">
            <Link className="account-back" href="/tai-khoan">Tài khoản</Link>
            <Link className="account-back" href="/tao-thiep">Về phòng tạo thiệp</Link>
          </nav>
        </header>

        <section className="account-panel admin-management-intro">
          <div>
            <p className="account-eyebrow">KHU VỰC QUẢN TRỊ</p>
            <h1>Quản lý thiệp xem thử</h1>
            <p>Theo dõi chủ sở hữu, thời hạn và mở thiệp để xem nội dung. Admin có thể gia hạn từng thiệp thêm 7 ngày.</p>
          </div>
          {user?.isAdmin && <span className="account-admin-badge">{user.email}</span>}
        </section>

        {notice && <p className="account-notice" role="status">{notice}</p>}
        {pageError && <p className="account-error" role="alert">{pageError}</p>}

        {loading ? <section className="account-panel account-loading">Đang tải danh sách thiệp…</section>
          : !user ? <section className="account-panel admin-access-panel">
            <h2>Đăng nhập để tiếp tục</h2>
            <p>Đăng nhập bằng Google để kiểm tra quyền truy cập trang quản lý.</p>
            <Link className="account-primary-button" href="/tai-khoan?next=%2Fquan-ly-thiep">Đến trang đăng nhập</Link>
          </section>
            : !user.isAdmin ? <section className="account-panel admin-access-panel">
              <h2>Trang này chỉ dành cho quản trị viên</h2>
              <p>Tài khoản hiện tại không có quyền xem danh sách thiệp của mọi người.</p>
              <Link className="account-primary-button" href="/tai-khoan">Về tài khoản</Link>
            </section>
              : <>
                <section className="admin-trial-stats" aria-label="Tổng quan thiệp">
                  <article><span>Tổng số thiệp</span><strong>{trials.length}</strong></article>
                  <article><span>Đang hoạt động</span><strong>{activeCount}</strong></article>
                  <article><span>Đã hết hạn</span><strong>{expiredCount}</strong></article>
                </section>

                <section className="account-section account-admin-section admin-trials-section">
                  <div className="admin-trials-toolbar">
                    <label>
                      <span>Tìm theo tên thiệp, mã mẫu hoặc email</span>
                      <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Nhập từ khóa" />
                    </label>
                    <label>
                      <span>Trạng thái</span>
                      <select value={filter} onChange={(event) => setFilter(event.target.value as TrialFilter)}>
                        <option value="all">Tất cả thiệp</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="expired">Đã hết hạn</option>
                      </select>
                    </label>
                  </div>

                  <p className="admin-trials-count" role="status">Đang hiển thị {filteredTrials.length} / {trials.length} thiệp</p>
                  {filteredTrials.length ? <div className="account-admin-list">
                    {filteredTrials.map((trial) => {
                      const active = trial.expiresAt !== null && new Date(trial.expiresAt).getTime() > Date.now();
                      const daysRemaining = active && trial.expiresAt
                        ? Math.max(1, Math.ceil((new Date(trial.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
                        : 0;
                      return <article className="account-admin-row admin-trial-row" key={trial.id}>
                        <div className="account-admin-row-main">
                          <strong>{trial.title || trial.templateCode}</strong>
                          <span>{trial.ownerEmail || "Bản cũ chưa gắn tài khoản"} · {trial.templateCode}</span>
                          <small>Tạo {formatDate(trial.createdAt)} · Hết hạn {formatDate(trial.expiresAt)}</small>
                          <small>Đã gia hạn {trial.renewalCount || 0} lần</small>
                        </div>
                        <div className="account-admin-row-actions admin-trial-actions">
                          <span className={`account-status ${active ? "is-active" : "is-expired"}`}>{active ? `Còn ${daysRemaining} ngày` : "Đã hết hạn"}</span>
                          {active
                            ? <Link className="account-primary-button admin-trial-view" href={invitationPath(trial)} target="_blank" rel="noopener noreferrer">Mở xem thiệp</Link>
                            : <span className="account-disabled-button">Hết hạn</span>}
                          <button type="button" className="account-primary-button" disabled={busyRenewal === trial.id} onClick={() => void renewTrial(trial.id)}>
                            {busyRenewal === trial.id ? "Đang gia hạn…" : "Gia hạn 7 ngày"}
                          </button>
                        </div>
                      </article>;
                    })}
                  </div> : <div className="account-empty"><p>{trials.length ? "Không tìm thấy thiệp phù hợp." : "Chưa có thiệp xem thử nào được xuất bản."}</p></div>}
                </section>
              </>}
      </div>
    </main>
  );
}
