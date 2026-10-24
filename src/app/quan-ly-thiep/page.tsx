import type { Metadata } from "next";
import AdminTrialsDashboard from "./AdminTrialsDashboard";
import "../tai-khoan/account.css";
import "./admin-trials.css";

export const metadata: Metadata = {
  title: "Quản lý thiệp xem thử | kIsmet love",
  robots: { index: false, follow: false },
};

export default function AdminTrialsPage() {
  return <AdminTrialsDashboard />;
}
