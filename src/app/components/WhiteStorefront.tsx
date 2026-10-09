"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, ChevronDown, Heart, Menu, Paintbrush, Search, SlidersHorizontal, Sparkles, X, Mail, MousePointer2, Leaf, ExternalLink, BookOpen } from "lucide-react";
import { FEATURES, filterCatalog, getCatalog, PACKAGES, STYLES, TYPES, type CatalogItem, type PackageId } from "@/lib/storefront-catalog";
import type { PricingCurrency } from "@/lib/pricing";
import { CONTACT_PHONES } from "@/lib/contact";
import InvitationArtwork from "./InvitationArtwork";
import StoreReviews from "./StoreReviews";
import PricingSection from "./PricingSection";
import { Moodboard } from "./HomeInteractions";
import LivePreviewModal from "./LivePreviewModal";
import ConsultationButton, { ConsultationDialog } from "./ConsultationButton";
import ZaloContactDock from "./ZaloContactDock";

const SAVED_KEY = "kismet-saved-templates-v1";
const suiteParts = ["Thiệp mời", "RSVP", "Đếm ngược", "Dresscode", "Thẻ vị trí"];
function ProjectArtwork({ item }: { item: CatalogItem }) {
  if (!item.template) return <InvitationArtwork item={item} />;
  return <div className="ws-project-preview"><Image src={item.template.coverImage} alt={`Dự án ${item.template.coupleName} — ${item.name}`} fill sizes="(max-width: 600px) 80vw, 400px" /><div><small>{item.name}</small><span>{item.template.coupleName}</span></div></div>;
}
function SuiteArtwork({ part, item }: { part: number; item: CatalogItem }) {
  if (part === 0) return <InvitationArtwork item={item} />;
  const title = ["", "Kindly reply", "Until we say I do", "Dress with love", "Your seat awaits"][part];
  return <svg className="invitation-artwork" viewBox="0 0 400 540" role="img" aria-label={suiteParts[part]}>
    <rect width="400" height="540" fill={item.background} /><rect x="28" y="28" width="344" height="484" fill="none" stroke={item.color} opacity=".4" />
    <text x="200" y="125" textAnchor="middle" fontFamily="Georgia" fontSize="11" letterSpacing="3" fill={item.color}>AN & MINH</text>
    <text x="200" y="205" textAnchor="middle" fontFamily="Georgia" fontSize="32" fontStyle="italic" fill={item.color}>{title}</text>
    {part === 1 && <g fill={item.color} fontFamily="Georgia" fontSize="14" textAnchor="middle"><text x="200" y="285">Joyfully accepts  /  Regretfully declines</text><text x="200" y="340">Please reply by 10 October</text><path d="M90 390H310" stroke={item.color} /></g>}
    {part === 2 && <g fill={item.color} fontFamily="Georgia" textAnchor="middle"><text x="200" y="310" fontSize="64">24 . 10</text><text x="200" y="355" fontSize="14">2026 · THE BEGINNING OF FOREVER</text></g>}
    {part === 3 && <g>{["#D1C4B8", "#D1D9C8", "#EFC7C2"].map((color, i) => <circle key={color} cx={130 + i * 70} cy="310" r="24" fill={color} />)}<text x="200" y="385" textAnchor="middle" fontFamily="Georgia" fontSize="14" fill={item.color}>Cream, sage & a touch of blush</text></g>}
    {part === 4 && <g fill={item.color} textAnchor="middle" fontFamily="Georgia"><text x="200" y="310" fontSize="64">01</text><text x="200" y="370" fontSize="16">A place just for you</text></g>}
  </svg>;
}

export default function WhiteStorefront({ currency }: { currency: PricingCurrency }) {
  const items = useMemo(() => getCatalog(currency), [currency]);
  const heroStandard = items.find(item => item.packageId === "standard" && item.template)!;
  const heroCustomized = items.find(item => item.packageId === "customized" && item.template)!;
  const [pkg, setPkg] = useState<PackageId | "">("");
  const [style, setStyle] = useState("");
  const [type, setType] = useState("");
  const [query, setQuery] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [sort, setSort] = useState("featured");
  const [collection, setCollection] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [remoteItems, setRemoteItems] = useState<CatalogItem[] | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);
  const [savedOnly, setSavedOnly] = useState(false);
  const [hoverMenu, setHoverMenu] = useState<PackageId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickView, setQuickView] = useState<CatalogItem | null>(null);
  const [livePreview, setLivePreview] = useState<CatalogItem | null>(null);
  const [consultation, setConsultation] = useState<CatalogItem | null>(null);
  const [side, setSide] = useState<"front" | "back">("front");
  const [suitePart, setSuitePart] = useState(0);
  const [story, setStory] = useState("all");
  const [newsletterState, setNewsletterState] = useState<"idle" | "sending" | "success">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [info, setInfo] = useState<"privacy" | "terms" | "drafts" | null>(null);
  const [drafts, setDrafts] = useState<{ id: string; name: string }[]>([]);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const quickDialog = useRef<HTMLDialogElement>(null);
  const infoDialog = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]");
      if (Array.isArray(stored)) setSaved(stored.filter((id): id is string => typeof id === "string" && items.some(item => item.id === id)));
    } catch { setStorageError("Không thể tải danh sách mẫu đã lưu."); }
    setStorageReady(true);
    return () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); };
  }, [items]);
  useEffect(() => {
    if (!storageReady) return;
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(saved)); } catch { setStorageError("Không thể lưu trên thiết bị này. Hãy cho phép bộ nhớ trình duyệt."); }
  }, [saved, storageReady]);
  useEffect(() => {
    const dialog = quickDialog.current;
    if (quickView && dialog && !dialog.open) dialog.showModal();
    if (!quickView && dialog?.open) dialog.close();
  }, [quickView]);
  useEffect(() => {
    const dialog = infoDialog.current;
    if (info && dialog && !dialog.open) dialog.showModal();
    if (!info && dialog?.open) dialog.close();
  }, [info]);
  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => { if (e.key === "Escape") { setHoverMenu(null); setMobileOpen(false); } };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  const filterParams = useMemo(() => {
    const params = new URLSearchParams({ q: query, package: pkg, style, type, sort, collection });
    features.forEach(feature => params.append("feature", feature));
    return params.toString();
  }, [query, pkg, style, type, sort, features, collection]);
  useEffect(() => {
    const controller = new AbortController();
    setRemoteItems(null); setVisibleCount(9); setCatalogError(""); setCatalogLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/templates?${filterParams}&limit=24`, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("Chưa thể cập nhật kho mẫu từ máy chủ. Đang hiển thị kho mẫu sẵn có.");
        const result = await response.json();
        if (!controller.signal.aborted && result.currency === currency) setRemoteItems(result.items);
      } catch (error) { if (!controller.signal.aborted) setCatalogError(error instanceof Error ? error.message : "Kết nối bị gián đoạn."); }
      finally { if (!controller.signal.aborted) setCatalogLoading(false); }
    }, 220);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [filterParams, currency]);
  const filtered = useMemo(() => (remoteItems ?? filterCatalog(items, new URLSearchParams(filterParams))).filter(item => !savedOnly || saved.includes(item.id)), [remoteItems, items, filterParams, savedOnly, saved]);
  const activePackage = PACKAGES.find(item => item.id === pkg);
  function reset() { setPkg(""); setStyle(""); setType(""); setQuery(""); setFeatures([]); setSort("featured"); setCollection(""); setSavedOnly(false); }
  function choosePackage(id: PackageId) { setPkg(id); setSavedOnly(false); setHoverMenu(null); setMobileOpen(false); document.getElementById("kho-mau-thiep")?.scrollIntoView({ behavior: "smooth" }); }
  function openQuick(item: CatalogItem) { setSide("front"); setQuickView(item); }
  function openDrafts() {
    try { setDrafts(items.filter(item => !!localStorage.getItem(`kismet-design-v1-${item.id}`)).map(item => ({ id: item.id, name: item.name }))); } catch { setDrafts([]); }
    setInfo("drafts");
  }
  function hover(id: PackageId | null) {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHoverMenu(id), id ? 180 : 220);
  }
  async function subscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setNewsletterState("sending"); setNewsletterMessage("");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.get("email"), consent: data.get("consent") === "on", website: data.get("website") }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setNewsletterState("success"); setNewsletterMessage("Cảm ơn bạn. Email đã được đăng ký nhận cảm hứng và mẫu mới."); form.reset();
    } catch (error) { setNewsletterState("idle"); setNewsletterMessage(error instanceof Error ? error.message : "Kết nối bị gián đoạn. Vui lòng thử lại."); }
  }

  return <main className="white-store" id="top">
    <a className="ws-skip" href="#kho-mau-thiep">Đến kho mẫu thiệp</a>
    <div className="ws-announcement"><span>Một lời mời đẹp. Một khởi đầu thương.</span><div className="ws-hotlines" aria-label="Hai số Zalo tư vấn"><span>Zalo:</span>{CONTACT_PHONES.map(phone => <a key={phone.number} href={phone.zaloUrl} target="_blank" rel="noopener noreferrer" title={`Nhắn Zalo: ${phone.label}`}>{phone.label}</a>)}</div><Link href="/design">Khám phá trình thiết kế miễn phí <ArrowRight size={12} /></Link></div>
    <header className="ws-header">
      <Link className="ws-brand" href="/" aria-label="kIsmet love — trang chủ">kIsmet <em>love</em><span>WEDDING & LITTLE THINGS</span></Link>
      <nav className="ws-nav" aria-label="Danh mục mẫu thiệp" onMouseLeave={() => hover(null)}>
        {PACKAGES.map(pack => <div key={pack.id} className="ws-nav-item" onMouseEnter={() => hover(pack.id)}>
          <button onClick={() => setHoverMenu(hoverMenu === pack.id ? null : pack.id)} onFocus={() => { if (hoverTimer.current) clearTimeout(hoverTimer.current); setHoverMenu(pack.id); }} aria-expanded={hoverMenu === pack.id} aria-controls={`menu-${pack.id}`}>{pack.name}{pack.id === "self-customized" ? <Paintbrush size={13} /> : <ChevronDown size={11} />}</button>
          {hoverMenu === pack.id && <div className="ws-mega" id={`menu-${pack.id}`}><div><span className="ws-kicker">{pack.name}</span><h3>{pack.note}</h3><p>{pack.description}</p><small>{pack.features}</small><button className="ws-text-link" onClick={() => choosePackage(pack.id)}>Khám phá bộ sưu tập <ArrowRight size={14} /></button></div><div className="ws-mega-samples">{!items.some(item => item.packageId === pack.id) && <p className="ws-menu-empty">Liên hệ studio để xem mẫu phù hợp với gói {pack.name}.</p>}{items.filter(item => item.packageId === pack.id).slice(0, 2).map(item => <button key={item.id} onClick={() => { setHoverMenu(null); openQuick(item); }}><ProjectArtwork item={item} /><span>{item.name}</span></button>)}</div></div>}
        </div>)}
      </nav>
      <div className="ws-header-tools"><a className="ws-price-link" href="#bang-gia">Các gói & bảng giá</a><button aria-label="Tìm mẫu thiệp" onClick={() => { document.getElementById("kho-mau-thiep")?.scrollIntoView(); searchRef.current?.focus({ preventScroll: true }); }}><Search size={19} /></button><button aria-label="Bản thiết kế của bạn trên thiết bị" onClick={openDrafts}><BookOpen size={19} /></button><button aria-label={`Xem ${saved.length} thiệp đã lưu`} className="ws-saved-button" aria-pressed={savedOnly} onClick={() => { setSavedOnly(!savedOnly); document.getElementById("kho-mau-thiep")?.scrollIntoView(); }}><Heart size={19} /><span>{saved.length}</span></button><button className="ws-mobile-toggle" aria-label="Mở danh mục" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button></div>
      {mobileOpen && <nav className="ws-mobile-nav" aria-label="Danh mục trên điện thoại">{PACKAGES.map(pack => <button key={pack.id} onClick={() => choosePackage(pack.id)}>{pack.name}<small>{pack.note}</small><ArrowRight size={16} /></button>)}<Link href="/design"><Paintbrush size={16} /> Tự thiết kế</Link></nav>}
    </header>

    <section className="ws-hero ws-wrap" aria-labelledby="hero-title">
      <div className="ws-hero-copy"><p className="ws-kicker"><span /> LITTLE DETAILS. LASTING MEMORIES.</p><h1 id="hero-title">Wedding Templates<br />You Can <em>Edit.</em></h1><p>Một lời mời mang dấu ấn của hai bạn.<br />Chọn mẫu yêu thích, viết câu chuyện riêng và gửi lời thương — thật nhẹ nhàng.</p><div className="ws-hero-actions"><a href="#kho-mau-thiep" className="ws-primary">Khám phá mẫu thiệp <ArrowRight size={16} /></a><a href="#quy-trinh" className="ws-secondary">Cách thực hiện <ArrowDown size={15} /></a><a href="#bang-gia" className="ws-secondary">Xem các gói & bảng giá <ArrowRight size={15} /></a></div><div className="ws-hero-assurance"><span><Check size={14} /> Chỉnh sửa ngay trên trình duyệt</span><span><Check size={14} /> Thiết kế bằng sự dịu dàng</span></div></div>
      <div className="ws-hero-art" aria-label="Các dự án thiệp cưới của kIsmet love"><span className="ws-art-note">a little piece of your forever</span><div className="ws-hero-envelope" /><button className="ws-hero-card ws-hero-main ws-hero-project" aria-label={`Xem dự án ${heroStandard.template!.coupleName}`} onClick={() => setLivePreview(heroStandard)}><ProjectArtwork item={heroStandard} /></button><button className="ws-hero-card ws-hero-small ws-hero-project" aria-label={`Xem dự án ${heroCustomized.template!.coupleName}`} onClick={() => setLivePreview(heroCustomized)}><ProjectArtwork item={heroCustomized} /></button><div className="ws-hero-photo"><Image src={heroStandard.template!.coverImage} alt={`Ảnh dự án ${heroStandard.template!.coupleName}`} fill priority sizes="(max-width: 700px) 25vw, 180px" /><span>all you need is love.</span></div><span className="ws-seal">k<span>with love</span></span><Leaf className="ws-hero-leaf" size={110} strokeWidth={.7} aria-hidden="true" /></div>
    </section>
    <div className="ws-trust-strip"><span><MousePointer2 size={17} /> Tự chỉnh sửa dễ dàng</span><span><Mail size={17} /> Gửi lời mời trong một chạm</span><span><Leaf size={17} /> Nhẹ nhàng với môi trường</span><span><Heart size={17} /> Riêng như chuyện tình của bạn</span></div>

    <section className="ws-catalog ws-wrap" id="kho-mau-thiep" aria-labelledby="catalog-title">
      <div className="ws-section-heading"><div><p className="ws-kicker">THE WEDDING COLLECTION</p><h2 id="catalog-title">Tìm một lời mời <em>thật riêng.</em></h2></div><p>Từ tối giản đến lãng mạn.<br />Có một thiết kế dành cho câu chuyện của bạn.</p></div>
      <div className="ws-package-tabs" role="group" aria-label="Chọn gói thiệp"><button aria-pressed={!pkg} onClick={() => setPkg("")}>Tất cả mẫu</button>{PACKAGES.map(pack => <button key={pack.id} aria-pressed={pkg === pack.id} onClick={() => setPkg(pack.id)}>{pack.name}{pack.id === "self-customized" && <span><Paintbrush size={10} /> Tự thiết kế</span>}</button>)}</div>
      <div className="ws-feature-summary" aria-live="polite"><Sparkles size={16} /><span>{activePackage ? <><strong>{activePackage.name}</strong> — {activePackage.features}</> : <>Lời mời tĩnh tự chỉnh sửa & website thiệp cưới trọn gói — chọn cách kể chuyện của bạn.</>}</span><Link href="/design">Mở trình thiết kế <ArrowRight size={13} /></Link></div>
      <div className="ws-filter-bar"><label className="ws-search"><Search size={16} /><input ref={searchRef} type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm mẫu thiệp…" aria-label="Tìm theo tên mẫu hoặc phong cách" /></label><label><span>Phong cách</span><select value={style} onChange={e => setStyle(e.target.value)}><option value="">Tất cả phong cách</option>{STYLES.map(s => <option key={s}>{s}</option>)}</select></label><label><span>Loại thiệp</span><select value={type} onChange={e => setType(e.target.value)}><option value="">Tất cả loại thiệp</option>{TYPES.map(t => <option key={t}>{t}</option>)}</select></label><label><span>Sắp xếp</span><select value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Nổi bật nhất</option><option value="new">Mới nhất</option><option value="price">Giá thấp đến cao</option></select></label></div>
      <div className="ws-feature-filters"><span><SlidersHorizontal size={13} /> Tính năng:</span>{FEATURES.map(feature => <button key={feature.id} aria-pressed={features.includes(feature.id)} onClick={() => setFeatures(prev => prev.includes(feature.id) ? prev.filter(id => id !== feature.id) : [...prev, feature.id])}>{features.includes(feature.id) && <Check size={11} />}{feature.label}</button>)}{(pkg || style || type || query || features.length > 0 || savedOnly || collection) && <button className="ws-reset" onClick={reset}>Xóa bộ lọc <X size={12} /></button>}</div>
      <div className="ws-results-bar"><div role="group" aria-label="Bộ sưu tập"><button aria-pressed={!collection} onClick={() => setCollection("")}>Tất cả</button><button aria-pressed={collection === "selected"} onClick={() => setCollection("selected")}>Studio tuyển chọn</button><button aria-pressed={collection === "new"} onClick={() => setCollection("new")}>Mẫu mới</button></div><span role="status">{catalogLoading ? "Đang cập nhật · " : ""}{filtered.length} mẫu{savedOnly ? " đã lưu" : " dành cho bạn"}</span></div>
      {catalogError && <p className="ws-notice" role="status">{catalogError}</p>}
      {storageError && <p className="ws-notice" role="status">{storageError}</p>}
      <div className="ws-template-grid">{filtered.slice(0, visibleCount).map(item => <article className="ws-template-card" key={item.id}><div className="ws-card-preview"><span className={`ws-card-badge ${item.tag === "New" ? "is-new" : ""}`}>{item.tag}</span><button className="ws-card-save" aria-label={`${saved.includes(item.id) ? "Bỏ lưu" : "Lưu"} ${item.name}`} aria-pressed={saved.includes(item.id)} onClick={() => setSaved(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id])}><Heart size={17} fill={saved.includes(item.id) ? "currentColor" : "none"} /></button><button className="ws-art-button" aria-label={`Xem nhanh ${item.name}`} onClick={() => openQuick(item)}>{item.template ? <div className="ws-live-cover"><Image src={item.template.coverImage} fill sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw" alt={`Mẫu thiệp ${item.name}`} /><div><small>THE WEDDING OF</small><span>{item.template.coupleName}</span><small>{item.name}</small></div></div> : <div className={`ws-flatlay ws-flatlay-${item.motif}`}><span className="ws-flatlay-envelope" /><span className="ws-flatlay-extra"><SuiteArtwork part={1} item={item} /></span><span className="ws-flatlay-main"><InvitationArtwork item={item} /></span><Leaf className="ws-flatlay-leaf" size={70} strokeWidth={.7} /></div>}</button><button className="ws-quick-button" onClick={() => openQuick(item)}>Xem nhanh <ArrowRight size={13} /></button></div><div className="ws-card-info"><div><span>{item.style} · {PACKAGES.find(pack => pack.id === item.packageId)?.name}</span><div className="ws-swatches"><i style={{ background: item.background }} /><i style={{ background: item.color }} /><i style={{ background: "#D1C4B8" }} /></div></div><h3><button onClick={() => openQuick(item)}>{item.name}</button></h3><div className="ws-card-bottom"><p>{item.type}</p><strong>{item.price}</strong></div><div className="ws-card-actions">{item.template ? <><button onClick={() => setLivePreview(item)}>Xem thiệp trực tiếp <ExternalLink size={12} /></button>{item.template.tryUrl ? <Link href={item.template.tryUrl}>Thử thay ảnh <ArrowRight size={12} /></Link> : <button onClick={() => setConsultation(item)}>Tư vấn riêng <ArrowRight size={12} /></button>}</> : <><Link href={`/design?template=${item.id}`}>Tự chỉnh sửa <ArrowRight size={12} /></Link><span>SVG · 2 mặt</span></>}</div></div></article>)}</div>
      {visibleCount < filtered.length && <button className="ws-primary ws-load-more" onClick={() => setVisibleCount(value => value + 9)}>Xem thêm mẫu <ArrowDown size={14} /></button>}
      {!filtered.length && <div className="ws-empty"><Search size={28} strokeWidth={1} /><h3>Chưa có mẫu phù hợp.</h3><p>{savedOnly ? "Lưu những mẫu bạn yêu thích bằng nút trái tim để xem lại ở đây." : "Thử bớt một tính năng hoặc chọn phong cách khác nhé."}</p><button className="ws-primary" onClick={reset}>Xem tất cả mẫu <ArrowRight size={14} /></button></div>}
      <div className="ws-catalog-note"><span><Check size={14} /> Các mẫu stationery mở trong editor miễn phí.</span><span>Website RSVP & VietQR được cung cấp theo gói dịch vụ.</span></div>
    </section>

    <PricingSection currency={currency} />

    <section className="ws-suite-section" aria-labelledby="suite-title"><div className="ws-suite ws-wrap"><div className="ws-suite-visual"><div className="ws-suite-shadow" /><div className="ws-suite-card"><SuiteArtwork part={suitePart} item={items[0]} /></div><span className="ws-art-note">beautifully together, just like you.</span></div><div className="ws-suite-copy"><p className="ws-kicker">EVERY DETAIL, IN HARMONY</p><h2 id="suite-title">Một câu chuyện.<br /><em>Một bộ thiệp đồng điệu.</em></h2><p>Từ lời mời đầu tiên đến chiếc thẻ trên bàn tiệc, từng chi tiết cùng mang một sắc màu, một tinh thần, một dấu ấn của hai bạn.</p><div className="ws-suite-tabs" role="group" aria-label="Xem từng món trong bộ thiệp">{suiteParts.map((part, index) => <button key={part} aria-pressed={suitePart === index} onClick={() => setSuitePart(index)}>{index === 0 ? <Mail size={18} /> : index === 1 ? <Check size={18} /> : index === 2 ? <Sparkles size={18} /> : index === 3 ? <Leaf size={18} /> : <Heart size={18} />}<span>{part}</span></button>)}</div><p className="ws-suite-caption" role="status">Đang xem: {suiteParts[suitePart]} · Sage Vows</p><Link className="ws-text-link" href="/design?template=sage-vows">Tự chỉnh sửa thiệp mời <ArrowRight size={15} /></Link></div></div></section>

    <section className="ws-how ws-wrap" id="quy-trinh" aria-labelledby="how-title"><p className="ws-kicker">A LITTLE EASIER, A LOT MORE YOU</p><h2 id="how-title">Lời mời đẹp, <em>chỉ trong ba bước.</em></h2><div className="ws-steps">{[{ icon: <Search size={24} />, title: "Chọn một thiết kế", text: "Tìm phong cách đồng điệu với ngày cưới và câu chuyện của hai bạn." }, { icon: <Paintbrush size={24} />, title: "Viết dấu ấn riêng", text: "Thay tên, nội dung, font và màu sắc. Kéo chữ đến vị trí bạn muốn." }, { icon: <Mail size={24} />, title: "Gửi lời thương", text: "Tải SVG cho thiệp tĩnh, hoặc đặt website thiệp cưới để gửi link đến khách mời." }].map((step, index) => <article key={step.title}><span className="ws-step-number">0{index + 1}</span><div className="ws-step-icon">{step.icon}</div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div><Link className="ws-primary" href="/design">Thử thiết kế một chiếc thiệp <ArrowRight size={15} /></Link></section>

    <section className="mood-section" id="mau-thiep" aria-labelledby="mood-title">
      <div className="ws-wrap ws-mood-layout">
        <div className="mood-intro">
          <p className="ws-kicker">CẢM HỨNG SẮC MÀU</p>
          <h2 id="mood-title">Tình yêu của bạn<br /><em>mang sắc màu nào?</em></h2>
          <p>Một chút hoài niệm điện ảnh. Một chút trong trẻo dịu dàng.<br />Chọn một cảm xúc, để kIsmet love cùng bạn viết tiếp.</p>
        </div>
        <div className="mood-reveal"><Moodboard /></div>
      </div>
    </section>

    <section className="ws-editor-promo ws-wrap"><div><span className="ws-kicker"><Paintbrush size={13} /> MADE BY YOU, WITH LOVE</span><h2>Tự tay viết.<br /><em>Tự do sáng tạo.</em></h2><p>Không cần cài đặt. Không cần kinh nghiệm thiết kế.<br />Một chiếc thiệp của riêng bạn, ngay trong trình duyệt.</p><ul><li><Check size={13} /> Chỉnh chữ, font, màu & vị trí</li><li><Check size={13} /> Xem hai mặt, phóng to & tải SVG</li><li><Check size={13} /> Bản nháp tự lưu trên thiết bị</li></ul><Link href="/design" className="ws-primary">Mở trình thiết kế <ArrowRight size={15} /></Link><Link className="ws-text-link" href="/thu-thiep">Hoặc thử thay ảnh vào website thiệp cưới <ArrowRight size={13} /></Link></div><div className="ws-editor-mockup"><div className="ws-mockup-bar"><span>kIsmet <em>studio</em></span><span><Check size={11} /> Bản nháp trên thiết bị</span></div><div className="ws-mockup-body"><div className="ws-mockup-tools"><Paintbrush size={18} /><span>Aa</span><Leaf size={18} /><span className="ws-color-dot" /></div><div className="ws-mockup-card"><InvitationArtwork item={items[2]} /></div><span className="ws-mockup-cursor"><MousePointer2 size={18} fill="#59644f" /> your lovely idea</span></div></div></section>

    <section className="ws-stories ws-wrap" id="cam-nhan"><div className="ws-section-heading"><div><p className="ws-kicker">LOVE STORIES, BEAUTIFULLY TOLD</p><h2>Những câu chuyện <em>đã gửi trao.</em></h2></div><div className="ws-story-filter" role="group" aria-label="Lọc câu chuyện theo mẫu">{["all", "modern", "vintage"].map(value => <button key={value} aria-pressed={story === value} onClick={() => setStory(value)}>{value === "all" ? "Tất cả" : value === "modern" ? "Modern" : "Vintage"}</button>)}</div></div><div className="ws-story-grid">{items.filter(item => item.template && item.template.code !== "mau-500k" && (story === "all" || item.template.category === story)).map(item => <article key={item.id}><div className="ws-story-photo"><Image src={item.template!.coverImage} alt={item.template!.coupleName} fill sizes="(max-width: 700px) 90vw, 45vw" /></div><div><span className="ws-kicker">{item.style} · {item.name}</span><h3>{item.template!.coupleName}</h3><p>{item.template!.description}</p><button className="ws-text-link" onClick={() => setLivePreview(item)}>Mở lời mời của hai bạn <ArrowRight size={14} /></button></div></article>)}</div></section>

    <StoreReviews />
    <section className="ws-faq ws-wrap" id="hoi-dap"><div><p className="ws-kicker">BEFORE WE BEGIN</p><h2>Một chút <em>giải đáp.</em></h2><ConsultationButton className="ws-text-link">Trò chuyện cùng studio <ArrowRight size={14} /></ConsultationButton></div><div>{[
      ["Editor miễn phí có những gì?", "Bạn có thể thay chữ, font, màu nền, thêm hoặc xóa lớp chữ, kéo thả vị trí, xem hai mặt và tải bản SVG. Bản nháp được lưu trong trình duyệt trên thiết bị hiện tại."],
      ["Thiệp tĩnh và website thiệp cưới khác nhau thế nào?", "Thiệp tĩnh là thiết kế SVG bạn có thể tải về và dùng như stationery. Website thiệp cưới là lời mời trực tuyến có album ảnh, nhạc nền, bản đồ, RSVP và VietQR tùy gói dịch vụ. Các tính năng này không được tích hợp trong file SVG."],
      ["Mình có thể thử ảnh trước khi đặt website thiệp cưới không?", "Có. Chọn mẫu Standard hoặc Premium rồi bấm Thử thay ảnh để mở trình tùy chỉnh ảnh, thông tin ngày cưới và màu dresscode hiện có."],
      ["Bản nháp có được lưu trên đám mây không?", "Bản nháp tự lưu trên thiết bị. Trong trình thiết kế, bấm Lưu lên đám mây để bật tự đồng bộ vào MongoDB. Bản đám mây gắn với cookie của phiên trình duyệt hiện tại, chưa hỗ trợ đăng nhập đa thiết bị. Bạn có thể tải SVG để giữ bản thiết kế."],
      ["Làm thế nào để đặt mẫu Customized?", "Liên hệ studio để thống nhất concept, nội dung, hiệu ứng và phạm vi chỉnh sửa. Đội ngũ sẽ tư vấn gói phù hợp trước khi bắt đầu thiết kế riêng."],
    ].map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>

    <section className="ws-newsletter"><div className="ws-wrap"><div><span className="ws-kicker">LET LOVE FIND YOUR INBOX</span><h2>Một chút cảm hứng.<br /><em>Một chút lời thương.</em></h2><p>Nhận mẫu mới, ý tưởng cho ngày cưới và ưu đãi từ kIsmet love.</p></div><form onSubmit={subscribe}><label className="ws-email-label" htmlFor="newsletter-email">Email của bạn</label><div className="ws-email-row"><input id="newsletter-email" type="email" name="email" autoComplete="email" placeholder="you@lovestory.com" maxLength={254} required disabled={newsletterState === "sending"} /><button type="submit" disabled={newsletterState === "sending"}>{newsletterState === "sending" ? "Đang gửi…" : "Đăng ký"}<ArrowRight size={17} /></button></div><div className="ws-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div><label className="ws-consent"><input name="consent" type="checkbox" required /> Tôi đồng ý nhận bản tin và lưu email theo <button type="button" onClick={() => setInfo("privacy")}>chính sách riêng tư</button>.</label><p role="status" className="ws-form-status">{newsletterMessage}</p></form></div></section>
    <footer className="ws-footer ws-wrap"><div className="ws-footer-main"><div><Link href="/" className="ws-brand">kIsmet <em>love</em><span>WEDDING & LITTLE THINGS</span></Link><p>Lưu một ngày.<br /><em>Nhớ một đời.</em></p></div><div><h3>Bộ sưu tập</h3>{PACKAGES.map(pack => <button key={pack.id} onClick={() => choosePackage(pack.id)}>{pack.name}</button>)}</div><div><h3>Cùng bạn bắt đầu</h3><Link href="/design">Tự thiết kế thiệp</Link><Link href="/thu-thiep">Thử ảnh cưới</Link><a href="#bang-gia">Các gói & bảng giá</a><a href="#mau-thiep">Cảm hứng sắc màu</a><a href="#quy-trinh">Hướng dẫn cơ bản</a><a href="#hoi-dap">Câu hỏi thường gặp</a><button onClick={() => setInfo("terms")}>Điều khoản sử dụng</button><button onClick={() => setInfo("privacy")}>Chính sách riêng tư</button></div><div><h3>Gửi lời thương</h3>{CONTACT_PHONES.map(phone => <a key={phone.number} href={phone.zaloUrl} target="_blank" rel="noopener noreferrer" title={`Nhắn Zalo: ${phone.label}`}>{phone.label}</a>)}<ConsultationButton className="ws-text-link">Liên hệ studio <ArrowRight size={13} /></ConsultationButton><span className="ws-footer-palette">{["#FBF6F3", "#D1C4B8", "#B7A895", "#D1D9C8", "#EFC7C2"].map(color => <i key={color} style={{ background: color }} />)}</span></div></div><div className="ws-footer-bottom"><span>© 2026 kIsmet love</span><span>MADE WITH A LITTLE <Heart size={11} /> & A LOT OF LOVE</span><a href="#top">Về đầu trang ↑</a></div></footer>

    <dialog ref={quickDialog} className="ws-dialog ws-quick-dialog" onCancel={() => setQuickView(null)} onClick={e => { if (e.target === e.currentTarget) setQuickView(null); }} onClose={() => setQuickView(null)}>{quickView && <><button autoFocus className="ws-dialog-close" aria-label="Đóng xem nhanh" onClick={() => setQuickView(null)}><X size={20} /></button><div className="ws-quick-art">{quickView.template ? <ProjectArtwork item={quickView} /> : <InvitationArtwork item={quickView} side={side} />}{!quickView.template && <div className="ws-face-tabs"><button aria-pressed={side === "front"} onClick={() => setSide("front")}>Mặt trước</button><button aria-pressed={side === "back"} onClick={() => setSide("back")}>Mặt sau</button></div>}</div><div className="ws-quick-info"><p className="ws-kicker">{quickView.style} · {PACKAGES.find(pack => pack.id === quickView.packageId)?.name}</p><h2>{quickView.name}</h2><p>{quickView.template?.description ?? "Một thiết kế stationery nhẹ nhàng, có thể thay chữ, font và màu để hòa cùng concept của hai bạn."}</p><strong>{quickView.price}</strong>{quickView.template ? <><button className="ws-primary" onClick={() => { setQuickView(null); setLivePreview(quickView); }}>Xem website thiệp thực tế <ExternalLink size={14} /></button>{quickView.template.tryUrl && <Link className="ws-secondary" href={quickView.template.tryUrl}>Thử thay ảnh của bạn <ArrowRight size={14} /></Link>}<button className="ws-text-link" onClick={() => { setConsultation(quickView); setQuickView(null); }}>Liên hệ đặt mẫu <ArrowRight size={14} /></button></> : <><Link className="ws-primary" href={`/design?template=${quickView.id}`}>Tự chỉnh sửa <Paintbrush size={14} /></Link><p className="ws-small-note">Chỉnh sửa miễn phí · Tải SVG · Lưu bản nháp trên thiết bị</p></>}</div></>}</dialog>
    <dialog ref={infoDialog} className="ws-dialog ws-info-dialog" onCancel={() => setInfo(null)} onClose={() => setInfo(null)} onClick={e => { if (e.target === e.currentTarget) setInfo(null); }}><button autoFocus className="ws-dialog-close" aria-label="Đóng" onClick={() => setInfo(null)}><X size={20} /></button>{info === "drafts" ? <><p className="ws-kicker">YOUR LITTLE CREATIONS</p><h2>Bản thiết kế của bạn.</h2><p>Bản nháp được lưu trên thiết bị và trình duyệt này.</p>{drafts.length ? drafts.map(draft => <Link className="ws-draft-link" key={draft.id} href={`/design?template=${draft.id}`}>{draft.name}<ArrowRight size={15} /></Link>) : <p>Bạn chưa có bản nháp. Chọn một mẫu và mở editor để bắt đầu.</p>}<Link className="ws-primary" href="/design">Tạo bản thiết kế <ArrowRight size={14} /></Link></> : info === "privacy" ? <><h2>Chính sách riêng tư</h2><p>Email và thời điểm đồng ý nhận bản tin được lưu trong cơ sở dữ liệu của kIsmet love để gửi thông tin về mẫu mới, ý tưởng và ưu đãi. Chúng tôi không thu thập ảnh hay bản thiết kế thông qua form đăng ký này.</p><p>Mẫu yêu thích và bản nháp editor được lưu trong trình duyệt trên thiết bị của bạn. Xóa dữ liệu trang web sẽ xóa các bản nháp này.</p><p>Bạn có thể yêu cầu xóa email hoặc ngừng nhận bản tin qua số liên hệ của studio ở cuối trang.</p></> : <><h2>Điều khoản sử dụng</h2><p>Editor stationery cho phép chỉnh sửa và tải SVG cho nhu cầu cá nhân. Bạn chịu trách nhiệm về quyền sử dụng nội dung được thêm vào thiết kế.</p><p>Dịch vụ website thiệp cưới và thiết kế riêng cần thống nhất giá, thời gian giao, hosting và phạm vi chỉnh sửa với studio trước khi đặt. Các mẫu stationery miễn phí không bao gồm website RSVP, VietQR hay nhạc nền.</p><p>Bản nháp trên thiết bị không thay thế bản sao lưu. Hãy tải SVG để giữ thiết kế hoàn thiện.</p></>}</dialog>
    <ZaloContactDock />
    <LivePreviewModal template={livePreview?.template ?? null} onClose={() => setLivePreview(null)} onChoose={() => { setConsultation(livePreview); setLivePreview(null); }} />
    {consultation && <ConsultationDialog templateName={consultation.name} packageName={consultation.template?.packageLabel} onClose={() => setConsultation(null)} />}
  </main>;
}







