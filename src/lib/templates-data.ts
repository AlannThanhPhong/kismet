import { packagePrice, type PricingCurrency } from "./pricing";

export type TemplateCategory = "all" | "vintage" | "modern";

export type FrameShape = "rect-soft";

export type WeddingTemplateItem = {
  id: string;
  code: string;
  name: string;
  coupleName: string;
  category: TemplateCategory;
  categoryLabel: string;
  badge?: string;
  badgeType?: "hot" | "signature" | "top1" | "vintage" | "new" | "sale";
  frameShape: FrameShape;
  description: string;
  tone: string;
  colors: string[];
  coverImage: string;
  liveDemoUrl?: string;
  hasMusic: boolean;
  hasRsvp: boolean;
  hasMap: boolean;
  hasGallery: boolean;
  hasQr: boolean;
  packageLabel?: string;
};

export const WEDDING_TEMPLATES: WeddingTemplateItem[] = [
  {
    id: "hong-kong-1999",
    code: "20260110-NHVVAM",
    name: "HONG KONG 1999",
    coupleName: "Huyền Vy & Anh Minh",
    category: "vintage",
    categoryLabel: "Hoài Niệm / Film",
    badge: "SIGNATURE",
    badgeType: "signature",
    frameShape: "rect-soft",
    description: "Điện ảnh Hồng Kông thập niên 90. Ánh đỏ rượu vang quý phái, hạt phim hoài niệm và phông chữ Serif cổ điển.",
    tone: "Đỏ Rượu & Vàng Cổ Điển",
    colors: ["#642634", "#b88756", "#eddbb5"],
    coverImage: "/wedding-invitations/20260110-NHVVAM/images/photo_2026-10-08_13-24-23.jpg",
    liveDemoUrl: "/thiep/20260110-NHVVAM",
    hasMusic: true,
    hasRsvp: true,
    hasMap: true,
    hasGallery: true,
    hasQr: true,
  },
  {
    id: "ngay-minh-chung-doi",
    code: "20261027-KHVT",
    name: "NGÀY MÌNH CHUNG ĐÔI",
    coupleName: "Kim Hiên & Văn Tài",
    category: "modern",
    categoryLabel: "Trong Trẻo / Minimal",
    badge: "HOT NHẤT 2026",
    badgeType: "hot",
    frameShape: "rect-soft",
    description: "Nhẹ nhàng, thanh lịch như lời hẹn đầu tiên. Tông màu trắng ngà và xanh dịu tạo cảm giác sâu lắng.",
    tone: "Trắng Ngà & Xanh Dịu",
    colors: ["#64715c", "#c7c9b7", "#f2eee3"],
    coverImage: "/wedding-invitations/20261027-KHVT/images/0V7A7519-800.webp",
    liveDemoUrl: "/thiep/20261027-KHVT",
    hasMusic: true,
    hasRsvp: true,
    hasMap: true,
    hasGallery: true,
    hasQr: true,
  },
];

export function templatesForCurrency(currency: PricingCurrency = "VND"): (WeddingTemplateItem & { packageLabel?: string })[] {
  return WEDDING_TEMPLATES.map((item) => {
    const isCustom = item.id === "hong-kong-1999";
    const packageLabel = isCustom ? "Gói Custom · Thiết kế riêng" : `Gói Premium · ${packagePrice("premium", currency)}`;
    return {
      ...item,
      packageLabel,
    };
  });
}
