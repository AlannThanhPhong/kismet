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
  tags?: string[];
  templateNumber?: number;
  venue?: string;
  isRealProject?: boolean;
  badge?: string;
  badgeType?: "hot" | "signature" | "top1" | "vintage" | "new" | "sale";
  frameShape: FrameShape;
  description: string;
  tone: string;
  colors: string[];
  coverImage: string;
  liveDemoUrl?: string;
  tryUrl?: string;
  hasMusic: boolean;
  hasRsvp: boolean;
  hasMap: boolean;
  hasGallery: boolean;
  hasQr: boolean;
  packageTier?: "standard" | "premium" | "bespoke" | "custom";
  packageLabel?: string;
};

export const WEDDING_TEMPLATES: WeddingTemplateItem[] = [
  {
    id: "lovers-diary",
    code: "lovers-diary",
    name: "Lover’s Diary",
    coupleName: "Élodie Laurent & Gabriel Moreau",
    category: "modern",
    categoryLabel: "Scrapbook / Modern / Y2K",
    tags: ["Scrapbook", "Modern", "Y2K"],
    templateNumber: 1,
    venue: "Église Saint-Sulpice, Paris, France",
    isRealProject: false,
    badge: "TEMPLATE N° 01 · LOVER’S DIARY",
    badgeType: "top1",
    frameShape: "rect-soft",
    description: "Mẫu thiệp Lover’s Diary với câu chuyện tình yêu của Élodie Laurent & Gabriel Moreau tại Paris.",
    tone: "Burgundy, Warm Parchment & Crimson Ink",
    colors: ["#7b231f", "#f3f0e8", "#c81912"],
    coverImage: "/wedding-invitations/Lover%E2%80%99s%20Diary/images/photo_2026-10-21_18-13-28.jpg",
    liveDemoUrl: "/thiep/lovers-diary",
    tryUrl: "/tao-thiep?template=lovers-diary",
    hasMusic: true,
    hasRsvp: true,
    hasMap: true,
    hasGallery: true,
    hasQr: false,
    packageTier: "bespoke",
  },
  {
    id: "french-style",
    code: "french-style",
    name: "French Style",
    coupleName: "Élise Beaumont & Julien Laurent",
    category: "vintage",
    categoryLabel: "French Style / Luxury / Elegant",
    tags: ["French Style", "Luxury", "Elegant", "Romantic"],
    templateNumber: 2,
    venue: "Église Saint-Sulpice, Paris, France",
    isRealProject: false,
    badge: "TEMPLATE N° 02 · FRENCH STYLE",
    badgeType: "signature",
    frameShape: "rect-soft",
    description: "Mẫu thiệp French Style tông be – nâu sữa sang trọng với phong bì dấu sáp, họa tiết Toile de Jouy, rèm lụa thêu hoa và khung ảnh Cameo của Élise Beaumont & Julien Laurent tại Paris.",
    tone: "Warm Beige, Milk-Brown (Nâu Sữa) & Ivory Parchment",
    colors: ["#b69d84", "#f9f6f0", "#6e553e"],
    coverImage: "/wedding-invitations/French%20Style/images/photo_2026-10-22_16-41-16.jpg",
    liveDemoUrl: "/thiep/french-style",
    tryUrl: "/tao-thiep?template=french-style",
    hasMusic: true,
    hasRsvp: true,
    hasMap: true,
    hasGallery: true,
    hasQr: false,
    packageTier: "bespoke",
  },
  {
    id: "love-at-first-sight",
    code: "20260323-NDNL",
    name: "LOVE AT FIRST SIGHT",
    coupleName: "Ngọc Dũng & Ngọc Lan",
    category: "modern",
    categoryLabel: "Garden / Romantic",
    tags: ["Garden", "Romantic", "Modern"],
    isRealProject: true,
    badge: "THIỆP THỰC TẾ",
    badgeType: "signature",
    frameShape: "rect-soft",
    description: "Thiệp cưới Ngọc Dũng & Ngọc Lan với album ảnh vườn cưới, lịch trình buổi tiệc và bản đồ đến Victory Palace.",
    tone: "Olive Grove, Rose Dust & Burgundy",
    colors: ["#70702e", "#d3a6a3", "#5e0b15"],
    coverImage: "/wedding-invitations/20260323-NDNL/images/photo_2026-10-19_13-24-27.webp",
    liveDemoUrl: "/thiep/20260323-NDNL",
    hasMusic: false,
    hasRsvp: false,
    hasMap: true,
    hasGallery: true,
    hasQr: false,
    packageTier: "standard",
  },
  {
    id: "ngay-minh-chung-doi",
    code: "20261027-KHVT",
    name: "NGÀY MÌNH CHUNG ĐÔI",
    coupleName: "Kim Hiên & Văn Tài",
    category: "modern",
    categoryLabel: "Trong trẻo / Minimal",
    tags: ["Minimalist", "Elegant", "Garden", "Modern"],
    isRealProject: true,
    badge: "MẪU NÂNG CAO",
    badgeType: "hot",
    frameShape: "rect-soft",
    description: "Mẫu thực tế của Kim Hiên & Văn Tài Bìa phong bì mở thiệp sang trọng, tích hợp 2 bên Nhà Trai & Nhà Gái (2 bản đồ), album 30 ảnh HD, 2 mã VietQR và tặng logo tên riêng",
    tone: "Trắng Ngà & Xanh Dịu",
    colors: ["#64715c", "#c7c9b7", "#f2eee3"],
    coverImage: "/wedding-invitations/20261027-KHVT/images/0V7A7519-800.webp",
    liveDemoUrl: "/thiep/20261027-KHVT",
    hasMusic: true,
    hasRsvp: true,
    hasMap: true,
    hasGallery: true,
    hasQr: true,
    packageTier: "premium",
  },
  {
    id: "found-you-kept-you",
    code: "20261230-KHAG",
    name: "FOUND YOU, KEPT YOU",
    coupleName: "An Huynh & Pham Anh",
    category: "modern",
    categoryLabel: "Navy / Love Letter",
    tags: ["Digital Love Letter", "Romantic", "Modern"],
    isRealProject: true,
    badge: "CUSTOMIZED",
    badgeType: "signature",
    frameShape: "rect-soft",
    description: "Thiệp của An Huynh & Pham Anh với máy đánh chữ, phong bì mở thành lá thư ở đầu trang, câu chuyện tình yêu và album 22 ảnh cưới.",
    tone: "Navy & Kem",
    colors: ["#152238", "#FAEBD7"],
    coverImage: "/wedding-invitations/20261230-KHAG/images/hero-forest-bw.jpg",
    liveDemoUrl: "/thiep/20261230-KHAG",
    hasMusic: true,
    hasRsvp: false,
    hasMap: true,
    hasGallery: true,
    hasQr: false,
    packageTier: "custom",
  },
  {
    id: "korean-garden-green",
    code: "20260823-NDTD",
    name: "JUST ONLY YOU",
    coupleName: "Thanh Điền & Ngọc Dung",
    category: "modern",
    categoryLabel: "Hàn Quốc / Xanh lá",
    tags: ["Korean Style", "Garden", "Romantic", "Modern"],
    isRealProject: true,
    badge: "MẪU PREMIUM",
    badgeType: "new",
    frameShape: "rect-soft",
    description: "Mẫu thực tế của Thanh Điền & Ngọc Dung, phong cách Hàn Quốc với tông xanh lá, nền trắng và bố cục thoáng. Ảnh chủ đề, album ảnh cưới, thông tin hai gia đình, chỉ đường và lưu lịch ngày vui.",
    tone: "Xanh Lá & Trắng Ngà",
    colors: ["#244b35", "#e9efdf", "#f6f8f2"],
    coverImage: "/wedding-invitations/20260823-NDTD/images/web/hero.webp",
    liveDemoUrl: "/thiep/20260823-NDTD",
    hasMusic: false,
    hasRsvp: false,
    hasMap: true,
    hasGallery: true,
    hasQr: false,
    packageTier: "bespoke",
  },
  {
    id: "hong-kong-1999",
    code: "20260110-NHVVAM",
    name: "HONG KONG 1999",
    coupleName: "Huyền Vy & Anh Minh",
    category: "vintage",
    categoryLabel: "Hoài niệm / Film",
    tags: ["Vintage", "Cinematic", "Romantic"],
    isRealProject: true,
    badge: "CUSTOMIZED",
    badgeType: "signature",
    frameShape: "rect-soft",
    description: "Mẫu thực tế của Huyền Vy & Anh Minh Điện ảnh Hồng Kông thập niên 90 độc bản Hiệu ứng hoạt họa xe đạp, hạt phim hoài niệm, thư tình và thiết kế riêng 1-1",
    tone: "Đỏ Rượu & Vàng Cổ Điển",
    colors: ["#642634", "#b88756", "#eddbb5"],
    coverImage: "/wedding-invitations/20260110-NHVVAM/images/best.jpg",
    liveDemoUrl: "/thiep/20260110-NHVVAM",
    hasMusic: true,
    hasRsvp: true,
    hasMap: true,
    hasGallery: true,
    hasQr: true,
    packageTier: "custom",
  },
];

export function templatesForCurrency(currency: PricingCurrency = "VND"): (WeddingTemplateItem & { packageLabel?: string })[] {
  return WEDDING_TEMPLATES.map((item) => {
    let packageLabel = "";
    if (item.packageTier === "standard") {
      packageLabel = `Basic · ${packagePrice("standard", currency)}`;
    } else if (item.packageTier === "premium") {
      packageLabel = `Standard · ${packagePrice("premium", currency)}`;
    } else if (item.packageTier === "custom") {
      packageLabel = "Customized · Liên hệ";
    } else {
      packageLabel = `Premium · ${packagePrice("bespoke", currency)}`;
    }
    return {
      ...item,
      packageLabel,
    };
  });
}
