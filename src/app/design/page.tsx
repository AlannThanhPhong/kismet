import { Suspense } from "react";
import type { Metadata } from "next";
import DesignEditor from "./DesignEditor";
import "../white-storefront.css";
import "./editor.css";

export const metadata: Metadata = { title: "Tự thiết kế thiệp cưới | kIsmet love", description: "Chỉnh sửa chữ, màu sắc, font và bố cục thiệp cưới trực tiếp trên trình duyệt" };
export default function DesignPage() {
  return <Suspense fallback={<div className="design-studio">Đang mở bàn thiết kế…</div>}><DesignEditor /></Suspense>;
}
