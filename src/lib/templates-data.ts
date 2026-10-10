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
    id: "mau-tieu-chuan-500k",
    code: "mau-500k",
    name: "MINIMAL IVORY",
    coupleName: "Thu Hà & Đức Anh",
    category: "modern",
    categoryLabel: "Trong trẻo / Minimal",
    badge: "MẪU TIÊU CHUẨN",
    badgeType: "new",
    frameShape: "rect-soft",
    description: "Thiết kế tối giản, hiện đại và thanh lịch Tích hợp 01 địa điểm & bản đồ chỉ đường, hộp mừng cưới VietQR, album 10 ảnh chất lượng cao và form xác nhận RSVP",
    tone: "Trắng Ngà & Vàng Champagne",
    colors: ["#ede6db", "#b59e7f", "#3a2e28"],
    coverImage: "/home/images/garden-wedding.jpg",
    liveDemoUrl: "/thu-thiep?package=standard&view=preview",
    tryUrl: "/thu-thiep?package=standard",
    hasMusic: true,
    hasRsvp: true,
    hasMap: true,
    hasGallery: true,
    hasQr: true,
    packageTier: "standard",
  },
  {
    id: "ngay-minh-chung-doi",
    code: "20261027-KHVT",
    name: "NGÀY MÌNH CHUNG ĐÔI",
    coupleName: "Kim Hiên & Văn Tài",
    category: "modern",
    categoryLabel: "Trong trẻo / Minimal",
    badge: "MẪU NÂNG CAO",
    badgeType: "hot",
    frameShape: "rect-soft",
    description: "Mẫu thực tế của Kim Hiên & Văn Tài Bìa phong bì mở thiệp sang trọng, tích hợp 2 bên Nhà Trai & Nhà Gái (2 bản đồ), album 30 ảnh HD, 2 mã VietQR và tặng logo tên riêng",
    tone: "Trắng Ngà & Xanh Dịu",
    colors: ["#64715c", "#c7c9b7", "#f2eee3"],
    coverImage: "/wedding-invitations/20261027-KHVT/images/0V7A7519-800.webp",
    liveDemoUrl: "/thiep/20261027-KHVT",
    tryUrl: "/thu-thiep?package=premium",
    hasMusic: true,
    hasRsvp: true,
    hasMap: true,
    hasGallery: true,
    hasQr: true,
    packageTier: "premium",
  },
  {
    id: "korean-garden-green",
    code: "20260823-NDTD",
    name: "JUST ONLY YOU",
    coupleName: "Thanh Điền & Ngọc Dung",
    category: "modern",
    categoryLabel: "Hàn Quốc / Xanh lá",
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
