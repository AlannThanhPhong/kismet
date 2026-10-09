import { templatesForCurrency, type WeddingTemplateItem } from "./templates-data";
import { PACKAGE_PRICES, type PricingCurrency } from "./pricing";

export const PACKAGES = [
  { id: "basic", name: "Basic", note: "Một lời mời giản đơn", features: "RSVP · 1 bản đồ · Nhạc nền · VietQR", description: "Website thiệp cưới nhỏ gọn, đầy đủ thông tin thiết yếu cho ngày vui của hai bạn" },
  { id: "standard", name: "Standard", note: "Đủ đầy cho ngày chung đôi", features: "RSVP · 2 bản đồ · Album HD · Hiệu ứng", description: "Trải nghiệm thiệp cưới với phong bì mở thiệp, âm nhạc và album ảnh, như dự án Kim Hiên & Văn Tài" },
  { id: "premium", name: "Premium", note: "Thêm một chút diệu kỳ", features: "Đặc quyền Standard · Lưu trữ trọn đời · Hỗ trợ ưu tiên", description: "Gói đầy đủ đặc quyền, lưu giữ ngày vui lâu dài Liên hệ studio để xem mẫu phù hợp" },
  { id: "customized", name: "Customized", note: "Chỉ riêng câu chuyện của bạn", features: "Concept riêng · Thiết kế 1–1 · Hoạt họa", description: "Cùng studio tạo một chiếc thiệp độc bản theo câu chuyện và concept của hai bạn" },
  { id: "self-customized", name: "Self-Customized", note: "Tự tay viết lời thương", features: "Editor trực tiếp · Font & màu · Kéo thả · Lưu trên thiết bị", description: "Chọn một thiết kế, thay tên, màu sắc và từng dòng chữ ngay trong trình duyệt" },
] as const;
export type PackageId = typeof PACKAGES[number]["id"];
export const STYLES = ["Minimalist", "Floral", "Luxury", "Vintage", "Modern", "Boho", "Classic", "Rustic"] as const;
export const TYPES = ["Invitation", "Save the Date", "Invitation Suite (3-Piece)", "Invitation Suite (5-Piece)", "Menu", "Sign"] as const;
export const FEATURES = [{ id: "music", label: "Nhạc nền" }, { id: "rsvp", label: "RSVP" }, { id: "gallery", label: "Album ảnh" }, { id: "qr", label: "VietQR" }, { id: "video", label: "Video" }] as const;
export type CatalogItem = {
  id: string; name: string; style: string; type: string; packageId: PackageId;
  features: string[]; color: string; background: string; motif: "arch" | "botanical" | "frame";
  tag: "Studio selection" | "New" | "Editable"; amount: number; price: string;
  template?: WeddingTemplateItem; created: number;
};
const designs: Omit<CatalogItem, "price" | "amount">[] = [
  { id: "sage-vows", name: "Sage Vows", style: "Floral", type: "Invitation Suite (3-Piece)", packageId: "self-customized", features: [], color: "#59644f", background: "#D1D9C8", motif: "botanical", tag: "Studio selection", created: 8 },
  { id: "ivory-arch", name: "Ivory Arch", style: "Minimalist", type: "Invitation", packageId: "basic", features: [], color: "#7c6954", background: "#FBF6F3", motif: "arch", tag: "Editable", created: 6 },
  { id: "blush-letter", name: "Blush Letter", style: "Classic", type: "Save the Date", packageId: "self-customized", features: [], color: "#936c64", background: "#EFC7C2", motif: "frame", tag: "New", created: 9 },
  { id: "wildflower-menu", name: "Wildflower Menu", style: "Rustic", type: "Menu", packageId: "self-customized", features: [], color: "#776a50", background: "#FBF6F3", motif: "botanical", tag: "Editable", created: 7 },
  { id: "quiet-luxury", name: "Quiet Luxury", style: "Luxury", type: "Invitation Suite (5-Piece)", packageId: "self-customized", features: [], color: "#6f6252", background: "#D1C4B8", motif: "frame", tag: "New", created: 10 },
  { id: "forever-sign", name: "Forever Together", style: "Boho", type: "Sign", packageId: "basic", features: [], color: "#806c5f", background: "#EFC7C2", motif: "arch", tag: "Editable", created: 5 },
];
export function getCatalog(currency: PricingCurrency): CatalogItem[] {
  return [...designs.map(item => ({ ...item, amount: 0, price: "Editor miễn phí" })), ...templatesForCurrency(currency).map((template, index): CatalogItem => ({
    id: template.id, name: template.name, style: template.category === "vintage" ? "Vintage" : index === 0 ? "Minimalist" : "Modern", type: "Invitation",
    packageId: template.packageTier === "custom" ? "customized" : template.packageTier === "bespoke" ? "premium" : template.packageTier === "premium" ? "standard" : "basic",
    features: [template.hasMusic && "music", template.hasRsvp && "rsvp", template.hasGallery && "gallery", template.hasQr && "qr"].filter((x): x is string => !!x),
    color: template.colors[0], background: "#FBF6F3", motif: "frame", tag: "Studio selection", amount: template.packageTier === "custom" ? Number.MAX_SAFE_INTEGER : PACKAGE_PRICES[currency][template.packageTier ?? "standard"], price: template.packageLabel?.split(" · ")[1] ?? "Liên hệ", template, created: 4 - index,
  }))];
}
export function filterCatalog(items: CatalogItem[], params: URLSearchParams) {
  const query = (params.get("q") ?? "").trim().toLocaleLowerCase("vi");
  const features = params.getAll("feature");
  const filtered = items.filter(item => (!params.get("package") || item.packageId === params.get("package")) && (!params.get("style") || item.style === params.get("style")) && (!params.get("type") || item.type === params.get("type")) && (!query || `${item.name} ${item.style} ${item.type}`.toLocaleLowerCase("vi").includes(query)) && features.every(feature => item.features.includes(feature)) && (params.get("collection") !== "new" || item.tag === "New") && (params.get("collection") !== "selected" || item.tag === "Studio selection"));
  if (params.get("sort") === "price") filtered.sort((a, b) => a.amount - b.amount);
  if (params.get("sort") === "new") filtered.sort((a, b) => b.created - a.created);
  return filtered;
}
