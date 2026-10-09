export type TemplateCategory = "all" | "vintage" | "modern" | "luxury" | "romantic";

export type WeddingTemplateItem = {
  id: string;
  code: string;
  name: string;
  coupleName: string;
  category: TemplateCategory;
  categoryLabel: string;
  packageLabel: string;
  badge?: string;
  badgeType?: "hot" | "signature" | "top1" | "vintage" | "new" | "sale";
  description: string;
  tone: string;
  colors: string[];
  coverImage: string;
  previewHeightClass?: string;
  liveDemoUrl?: string; // Path to real live iframe or page
  hasMusic: boolean;
  hasRsvp: boolean;
  hasMap: boolean;
  hasGallery: boolean;
  hasQr: boolean;
};

export const WEDDING_TEMPLATES: WeddingTemplateItem[] = [
  {
    id: "hong-kong-1999",
    code: "20260110-NHVVAM",
    name: "HONG KONG 1999",
    coupleName: "Huyền Vy & Anh Minh",
    category: "vintage",
    categoryLabel: "Hoài Niệm / Film",
    packageLabel: "Gói Custom · Báo giá theo nhu cầu",
    badge: "CUSTOM",
    badgeType: "signature",
    description: "Phong cách điện ảnh Hồng Kông thập niên 90. Ánh đỏ rượu vang quý phái, hạt phim hoài niệm và phông chữ Serif cổ điển.",
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
    packageLabel: "Gói 800.000đ",
    badge: "GÓI 800.000đ",
    badgeType: "hot",
    description: "Nhẹ nhàng, thanh lịch như lời hẹn ước đầu tiên. Tông màu trắng ngà và xanh xám thiên nhiên tạo cảm giác bình yên, sâu lắng.",
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
