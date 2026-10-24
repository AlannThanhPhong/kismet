import type { Metadata } from "next";
import AccountDashboard from "./AccountDashboard";
import "./account.css";

export const metadata: Metadata = {
  title: "Tài khoản & thiệp đã tạo | kIsmet love",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountDashboard />;
}
