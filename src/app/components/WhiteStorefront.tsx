"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, Heart, Menu, Paintbrush, Search, Sparkles, X, Mail, MousePointer2, Leaf, ExternalLink, BookOpen } from "lucide-react";
import { filterCatalog, getCatalog, PACKAGES, TEMPLATE_TAG_GROUPS, type CatalogItem, type PackageId } from "@/lib/storefront-catalog";
import { packagePrice, type PricingCurrency } from "@/lib/pricing";
import { CONTACT_EMAIL, CONTACT_PHONES } from "@/lib/contact";
import InvitationArtwork from "./InvitationArtwork";
import StoreReviews from "./StoreReviews";
import PricingSection from "./PricingSection";
import { Moodboard } from "./HomeInteractions";
import ConsultationButton, { ConsultationDialog } from "./ConsultationButton";
import ZaloContactDock from "./ZaloContactDock";

const SAVED_KEY = "kismet-saved-templates-v1";
const suiteParts = ["Thiệp mời", "RSVP", "Đếm ngược", "Dresscode", "Thẻ vị trí"];
function ProjectArtwork({ item }: { item: CatalogItem }) {
  if (item.coverImage) return <div className="ws-project-preview"><Image src={item.coverImage} alt={`Mẫu ${item.name}${item.coupleName ? ` — ${item.coupleName}` : ""}`} fill sizes="(max-width: 600px) 80vw, 400px" quality={95} unoptimized /><div><span>{item.name}</span></div></div>;
  if (!item.template) return <InvitationArtwork item={item} />;
  return <div className="ws-project-preview"><Image src={item.template.coverImage} alt={`Dự án ${item.template.coupleName} — ${item.name}`} fill sizes="(max-width: 600px) 80vw, 400px" /><div><small>{item.name}</small><span>{item.template.coupleName}</span></div></div>;
}
function projectPrice(item: CatalogItem, currency: PricingCurrency) {
  const tier = item.template?.packageTier;
  if (tier === "custom") return "Liên hệ";
  return packagePrice(tier === "premium" ? "premium" : tier === "bespoke" ? "bespoke" : "standard", currency);
}
function SuiteArtwork({ part, item }: { part: number; item: CatalogItem }) {
  if (part === 0) return <InvitationArtwork item={item} />;
  const title = ["", "Kindly reply", "Until we say I do", "Dress with love", "Your seat awaits"][part];
  const uid = `suite-${item.id}-${part}`;
  return <svg className="invitation-artwork" viewBox="0 0 400 540" role="img" aria-label={suiteParts[part]}>
    <defs>
      <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="400" y2="540" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.34" />
        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.04" />
        <stop offset="100%" stopColor="#3c352c" stopOpacity="0.11" />
      </linearGradient>
      <filter id={`${uid}-grain`} x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="3" seed="19" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.28  0 0 0 0 0.23  0 0 0 0 0.18  0.13 0 0 0 -0.02" />
      </filter>
    </defs>
    <rect width="400" height="540" fill={item.background} />
    <rect width="400" height="540" fill={`url(#${uid}-sheen)`} />
    <rect width="400" height="540" filter={`url(#${uid}-grain)`} opacity="0.9" />
    <rect x="13" y="13" width="374" height="514" fill="none" stroke="#3c352c" strokeOpacity="0.12" strokeWidth="1" />
    <rect x="14" y="14" width="374" height="514" fill="none" stroke="#ffffff" strokeOpacity="0.65" strokeWidth="1" />
    <rect x="28.8" y="28.8" width="344" height="484" fill="none" stroke="#ffffff" opacity=".55" />
    <rect x="28" y="28" width="344" height="484" fill="none" stroke={item.color} opacity=".45" />
    <text x="200" y="125" textAnchor="middle" fontFamily="Georgia" fontSize="11" letterSpacing="3" fill={item.color}>AN & MINH</text>
    <text x="200" y="205" textAnchor="middle" fontFamily="Georgia" fontSize="32" fontStyle="italic" fill={item.color}>{title}</text>
    {part === 1 && <g fill={item.color} fontFamily="Georgia" fontSize="14" textAnchor="middle"><text x="200" y="285">Joyfully accepts  /  Regretfully declines</text><text x="200" y="340">Please reply by 10 October</text><path d="M90 390H310" stroke={item.color} /></g>}
    {part === 2 && <g fill={item.color} fontFamily="Georgia" textAnchor="middle"><text x="200" y="310" fontSize="64">24 . 10</text><text x="200" y="355" fontSize="14">2026 · THE BEGINNING OF FOREVER</text></g>}
    {part === 3 && <g>{["#D1C4B8", "#D1D9C8", "#EFC7C2"].map((color, i) => <circle key={color} cx={130 + i * 70} cy="310" r="24" fill={color} stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.5" />)}<text x="200" y="385" textAnchor="middle" fontFamily="Georgia" fontSize="14" fill={item.color}>Cream, sage & a touch of blush</text></g>}
    {part === 4 && <g fill={item.color} textAnchor="middle" fontFamily="Georgia"><text x="200" y="310" fontSize="64">01</text><text x="200" y="370" fontSize="16">A place just for you</text></g>}
  </svg>;
}

export default function WhiteStorefront({ currency }: { currency: PricingCurrency }) {
  const items = useMemo(() => getCatalog(currency), [currency]);
  const storefrontItems = useMemo(() => items.filter(item => item.showInStorefront !== false), [items]);
  const realProjects = useMemo(() => storefrontItems.filter(item => item.template?.isRealProject ?? item.template?.liveDemoUrl?.startsWith("/thiep/") ?? false), [storefrontItems]);
  const realProjectIds = useMemo(() => new Set(realProjects.map(item => item.id)), [realProjects]);
  const suiteItem = items.find(item => item.id === "sage-vows") ?? items[0];
  const heroCustomized = items.find(item => item.packageId === "customized" && item.template)!;
  const [pkg, setPkg] = useState<PackageId | "">("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [openTagGroup, setOpenTagGroup] = useState<string | null>(null);
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
  const [consultation, setConsultation] = useState<CatalogItem | null>(null);
  const [side, setSide] = useState<"front" | "back">("front");
  const [suitePart, setSuitePart] = useState(0);
  const [newsletterState, setNewsletterState] = useState<"idle" | "sending" | "success">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [info, setInfo] = useState<"privacy" | "terms" | "drafts" | null>(null);
  const [drafts, setDrafts] = useState<{ id: string; name: string }[]>([]);
  const [templateSlideIndex, setTemplateSlideIndex] = useState(0);
  const [templatePaused, setTemplatePaused] = useState(false);
  const swipeStartX = useRef<number | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const quickDialog = useRef<HTMLDialogElement>(null);
  const infoDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]");
      if (Array.isArray(stored)) setSaved(stored.filter((id): id is string => typeof id === "string" && items.some(item => item.id === id)));
    } catch { setStorageError("Không thể tải danh sách mẫu đã lưu"); }
    setStorageReady(true);
    return () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); };
  }, [items]);
  useEffect(() => {
    if (!storageReady) return;
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(saved)); } catch { setStorageError("Không thể lưu trên thiết bị này Hãy cho phép bộ nhớ trình duyệt"); }
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
    const onEscape = (e: KeyboardEvent) => { if (e.key === "Escape") { setHoverMenu(null); setMobileOpen(false); setOpenTagGroup(null); } };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  const filterParams = useMemo(() => {
    const params = new URLSearchParams({ package: pkg });
    selectedTags.forEach(tag => params.append("tag", tag));
    return params.toString();
  }, [pkg, selectedTags]);
  useEffect(() => {
    const controller = new AbortController();
    setRemoteItems(null); setVisibleCount(9); setCatalogError(""); setCatalogLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/templates?${filterParams}&limit=24`, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("Chưa thể cập nhật kho mẫu từ máy chủ Đang hiển thị kho mẫu sẵn có");
        const result = await response.json();
        if (!controller.signal.aborted && result.currency === currency) setRemoteItems(result.items);
      } catch (error) { if (!controller.signal.aborted) setCatalogError(error instanceof Error ? error.message : "Kết nối bị gián đoạn"); }
      finally { if (!controller.signal.aborted) setCatalogLoading(false); }
    }, 220);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [filterParams, currency]);
  const filtered = useMemo(() => (remoteItems ?? filterCatalog(storefrontItems, new URLSearchParams(filterParams))).filter(item => item.showInStorefront !== false && !realProjectIds.has(item.id) && (!savedOnly || saved.includes(item.id))), [remoteItems, storefrontItems, filterParams, realProjectIds, savedOnly, saved]);
  const templateSlides = useMemo(() => {
    if (!filtered.length) return [];
    if (filtered.length === 1) return [0, 1, 2, 3].map(copy => ({ item: filtered[0], key: `${filtered[0].id}-c${copy}`, realIndex: 0 }));
    if (filtered.length < 4) {
      return [...filtered, ...filtered].map((item, idx) => ({
        item,
        key: `${item.id}-v${idx}`,
        realIndex: idx % filtered.length,
      }));
    }
    return filtered.map((item, idx) => ({ item, key: item.id, realIndex: idx }));
  }, [filtered]);
  const totalTemplateSlides = templateSlides.length;
  const activeTemplateSlideIndex = totalTemplateSlides ? ((templateSlideIndex % totalTemplateSlides) + totalTemplateSlides) % totalTemplateSlides : 0;
  const activeTemplateSlide = templateSlides[activeTemplateSlideIndex] ?? null;
  const activeTemplate = activeTemplateSlide?.item ?? null;

  useEffect(() => {
    setTemplateSlideIndex(0);
  }, [filterParams, savedOnly]);

  useEffect(() => {
    if (templatePaused || totalTemplateSlides < 2) return;
    const timer = setTimeout(() => {
      setTemplateSlideIndex(current => (current + 1) % totalTemplateSlides);
    }, 1950);
    return () => clearTimeout(timer);
  }, [activeTemplateSlideIndex, templatePaused, totalTemplateSlides]);

  function reset() { setPkg(""); setSelectedTags([]); setSavedOnly(false); }
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
      setNewsletterState("success"); setNewsletterMessage("Cảm ơn bạn Email đã được đăng ký nhận cảm hứng và mẫu mới"); form.reset();
    } catch (error) { setNewsletterState("idle"); setNewsletterMessage(error instanceof Error ? error.message : "Kết nối bị gián đoạn Vui lòng thử lại"); }
  }

  const projectPoetryNotes = [
    "a garden of first promises",
    "simply, beautifully us",
    "every word kept in love",
    "under the quiet green leaves",
    "a love like the movies",
  ];

  return <main className="white-store" id="top">
    <a className="ws-skip" href="#kho-mau-thiep">Đến kho mẫu thiệp</a>
    <div className="ws-announcement"><span>Một lời mời đẹp Một khởi đầu thương</span><div className="ws-hotlines" aria-label="Hai số Zalo tư vấn"><span>Zalo:</span>{CONTACT_PHONES.map(phone => <a key={phone.number} href={phone.zaloUrl} target="_blank" rel="noopener noreferrer" title={`Nhắn Zalo: ${phone.label}`}>{phone.label}</a>)}</div><Link href="/design">Khám phá trình thiết kế miễn phí <ArrowRight size={12} /></Link></div>
    <header className="ws-header">
      <Link className="ws-brand" href="/" aria-label="kIsmet love — trang chủ">kIsmet <em>love</em><span>WEDDING & LITTLE THINGS</span></Link>
      <nav className="ws-nav" aria-label="Danh mục mẫu thiệp" onMouseLeave={() => hover(null)}>
        {PACKAGES.map(pack => <div key={pack.id} className="ws-nav-item" onMouseEnter={() => hover(pack.id)}>
          <button className={pack.id === "self-customized" ? "ws-nav-pencil" : undefined} onClick={() => setHoverMenu(hoverMenu === pack.id ? null : pack.id)} onFocus={() => { if (hoverTimer.current) clearTimeout(hoverTimer.current); setHoverMenu(pack.id); }} aria-expanded={hoverMenu === pack.id} aria-controls={`menu-${pack.id}`}>{pack.name}{pack.id === "self-customized" ? <Paintbrush size={13} /> : <ChevronDown size={11} />}</button>
          {hoverMenu === pack.id && <div className="ws-mega" id={`menu-${pack.id}`}><div><span className="ws-kicker">{pack.name}</span><h3>{pack.note}</h3><p>{pack.description}</p><small>{pack.features}</small><button className="ws-text-link" onClick={() => choosePackage(pack.id)}>Khám phá bộ sưu tập <ArrowRight size={14} /></button></div><div className="ws-mega-samples">{!storefrontItems.some(item => item.packageId === pack.id) && <p className="ws-menu-empty">Liên hệ studio để xem mẫu phù hợp với gói {pack.name}</p>}{storefrontItems.filter(item => item.packageId === pack.id).slice(0, 2).map(item => <button key={item.id} onClick={() => { setHoverMenu(null); openQuick(item); }}><ProjectArtwork item={item} /><span>{item.name}</span></button>)}</div></div>}
        </div>)}
      </nav>
      <div className="ws-header-tools"><a className="ws-price-link" href="#bang-gia">Các gói & bảng giá</a><button aria-label="Đến kho mẫu thiệp" onClick={() => document.getElementById("kho-mau-thiep")?.scrollIntoView({ behavior: "smooth" })}><Search size={19} /></button><button aria-label="Bản thiết kế của bạn trên thiết bị" onClick={openDrafts}><BookOpen size={19} /></button><button aria-label={`Xem ${saved.length} thiệp đã lưu`} className="ws-saved-button" aria-pressed={savedOnly} onClick={() => { setSavedOnly(!savedOnly); document.getElementById("kho-mau-thiep")?.scrollIntoView(); }}><Heart size={19} /><span>{saved.length}</span></button><button className="ws-mobile-toggle" aria-label="Mở danh mục" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button></div>
      {mobileOpen && <nav className="ws-mobile-nav" aria-label="Danh mục trên điện thoại">{PACKAGES.map(pack => <button key={pack.id} onClick={() => choosePackage(pack.id)}>{pack.name}<small>{pack.note}</small><ArrowRight size={16} /></button>)}<Link href="/design"><Paintbrush size={16} /> Tự thiết kế</Link></nav>}
    </header>

    <section className="ws-hero ws-wrap" aria-labelledby="hero-title">
      <div className="ws-hero-copy"><p className="ws-kicker"><span /> LITTLE DETAILS LASTING MEMORIES</p><h1 id="hero-title">Wedding Templates<br />You Can <em>Edit</em></h1><p>Một lời mời mang dấu ấn của hai bạn<br />Chọn mẫu yêu thích, viết câu chuyện riêng và gửi lời thương — thật nhẹ nhàng</p><div className="ws-hero-actions"><a href="#kho-mau-thiep" className="ws-primary">Khám phá mẫu thiệp <ArrowRight size={16} /></a><a href="#quy-trinh" className="ws-secondary">Cách thực hiện <ArrowDown size={15} /></a><a href="#bang-gia" className="ws-secondary">Xem các gói & bảng giá <ArrowRight size={15} /></a></div><div className="ws-hero-assurance"><span><Check size={14} /> Chỉnh sửa ngay trên trình duyệt</span><span><Check size={14} /> Thiết kế bằng sự dịu dàng</span></div></div>
      <div className="ws-hero-art" aria-label="Dự án thiệp cưới Huyền Vy & Anh Minh"><span className="ws-art-note">a little piece of your forever</span><div className="ws-hero-envelope" /><a className="ws-hero-card ws-hero-main ws-hero-project" aria-label={`Xem dự án ${heroCustomized.template!.coupleName}`} href={heroCustomized.template!.liveDemoUrl ?? `/thiep/${heroCustomized.template!.code}`} target="_blank" rel="noopener noreferrer"><ProjectArtwork item={heroCustomized} /></a><span className="ws-seal">k<span>with love</span></span></div>
    </section>
    <div className="ws-trust-strip"><span><MousePointer2 size={17} /> Tự chỉnh sửa dễ dàng</span><span><Mail size={17} /> Gửi lời mời trong một chạm</span><span><Leaf size={17} /> Nhẹ nhàng với môi trường</span><span><Heart size={17} /> Riêng như chuyện tình của bạn</span></div>

    <section className="ws-projects ws-wrap" id="du-an-thiep" aria-labelledby="projects-title">
      <div className="ws-section-heading"><div><p className="ws-kicker">REAL WEDDING PROJECTS</p><h2 id="projects-title">Những câu chuyện <em>đã gửi trao</em></h2><p className="ws-kicker">Lưu giữ từ những ngày vui thật</p></div><p>Mỗi tấm thiệp là một kỷ vật riêng được gắn lên bàn lưu trữ của studio<br />Chạm vào từng khung ảnh để mở trọn vẹn câu chuyện của hai bạn</p></div>
      <div className="ws-projects-grid ws-projects-editorial">{realProjects.map((item, index) => <article className="ws-project-entry" key={item.id} data-index={index}>
        <div className="ws-project-card-sheet">
          <span className="ws-project-washi" aria-hidden="true" />
          <div className="ws-project-top-stamp">
            <span>STORY N° 0{index + 1}</span>
            <i>·</i>
            <strong>REAL WEDDING</strong>
          </div>
          <a className="ws-project-cover" href={item.template!.liveDemoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Xem thiệp ${item.template!.coupleName}`}>
            <ProjectArtwork item={item} />
            <span className="ws-project-handnote">{projectPoetryNotes[index % projectPoetryNotes.length]}</span>
          </a>
          <div className="ws-project-story-body">
            <div className="ws-project-meta">
              <span>Gói {PACKAGES.find(pack => pack.id === item.packageId)?.name}</span>
              <strong className="ws-project-price">{projectPrice(item, currency)}</strong>
            </div>
            <h3>{item.template!.coupleName}</h3>
            <p>{item.template!.description}</p>
            <div className="ws-card-tags ws-project-tags">
              {item.tags.map(tag => <span key={tag}>{tag}</span>)}
            </div>
            <div className="ws-project-story-footer">
              <a className="ws-text-link" href={item.template!.liveDemoUrl} target="_blank" rel="noopener noreferrer">Xem thiệp trực tiếp <ExternalLink size={14} /></a>
              <span className="ws-project-wax-dot" aria-hidden="true">k</span>
            </div>
          </div>
        </div>
      </article>)}</div>
    </section>

    <section className="ws-catalog ws-wrap" id="kho-mau-thiep" aria-labelledby="catalog-title">
      <div className="ws-catalog-mood ws-mood-layout">
        <div className="mood-intro"><p className="ws-kicker">CẢM HỨNG SẮC MÀU</p><h2>Tình yêu của bạn<br /><em>mang sắc màu nào?</em></h2><p>Chọn cảm xúc và phong cách hợp với câu chuyện của hai bạn, rồi khám phá những mẫu thiệp tương ứng.</p></div>
        <div className="mood-reveal"><Moodboard /></div>
      </div>
      <div className="ws-section-heading"><div><p className="ws-kicker">THE WEDDING COLLECTION</p><h2 id="catalog-title">Kho <em>thiệp mẫu</em></h2></div><p>Mẫu thiệp, bao gồm cả các Template<br />Lướt qua hoặc lọc theo những thẻ phong cách bạn thích</p></div>
      <div className="ws-template-tags" role="group" aria-label="Lọc mẫu theo thẻ" onPointerLeave={event => { const focusedByKeyboard = document.activeElement instanceof HTMLElement && document.activeElement.matches(":focus-visible"); if (event.pointerType === "mouse" && !event.currentTarget.contains(event.relatedTarget as Node | null) && !focusedByKeyboard) setOpenTagGroup(null); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenTagGroup(null); }}>
        <div className="ws-template-tag-groups">{TEMPLATE_TAG_GROUPS.map(group => <button className="ws-template-tag-parent" type="button" key={group.id} aria-expanded={openTagGroup === group.id} aria-controls={`template-tags-${group.id}`} onPointerEnter={event => { if (event.pointerType === "mouse") setOpenTagGroup(group.id); }} onPointerDown={event => { if (event.pointerType === "touch") setOpenTagGroup(current => current === group.id ? null : group.id); }} onFocus={() => setOpenTagGroup(group.id)} onClick={event => { if (event.detail === 0) setOpenTagGroup(group.id); }}>{group.label}</button>)}</div>
        {TEMPLATE_TAG_GROUPS.filter(group => group.id === openTagGroup).map(group => <div className="ws-template-tag-children" id={`template-tags-${group.id}`} role="group" aria-label={group.label} key={group.id}>{group.tags.map(tag => <button type="button" key={tag} aria-pressed={selectedTags.includes(tag)} onClick={() => setSelectedTags(current => current.includes(tag) ? current.filter(value => value !== tag) : [...current, tag])}>{selectedTags.includes(tag) && <Check size={12} />}{tag}</button>)}</div>)}
      </div>
      <p className="ws-results-count" role="status">{catalogLoading ? "Đang cập nhật · " : ""}{filtered.length} mẫu thiệp{savedOnly ? " đã lưu" : ""}</p>
      {catalogError && <p className="ws-notice" role="status">{catalogError}</p>}
      {storageError && <p className="ws-notice" role="status">{storageError}</p>}
      {activeTemplate && <div
        className="ws-artframe-showcase"
        onMouseEnter={() => setTemplatePaused(true)}
        onMouseLeave={() => setTemplatePaused(false)}
      >
        <div
          className="ws-artframe-stage"
          onTouchStart={event => {
            swipeStartX.current = event.touches[0]?.clientX ?? null;
            setTemplatePaused(true);
          }}
          onTouchEnd={event => {
            if (swipeStartX.current !== null && event.changedTouches[0]) {
              const deltaX = event.changedTouches[0].clientX - swipeStartX.current;
              if (Math.abs(deltaX) > 32) {
                setTemplateSlideIndex(current => (current + (deltaX < 0 ? 1 : -1) + totalTemplateSlides) % totalTemplateSlides);
              }
            }
            swipeStartX.current = null;
            setTemplatePaused(false);
          }}
          onPointerDown={event => {
            if (event.pointerType === "mouse") swipeStartX.current = event.clientX;
          }}
          onPointerUp={event => {
            if (event.pointerType === "mouse" && swipeStartX.current !== null) {
              const deltaX = event.clientX - swipeStartX.current;
              if (Math.abs(deltaX) > 45) {
                setTemplateSlideIndex(current => (current + (deltaX < 0 ? 1 : -1) + totalTemplateSlides) % totalTemplateSlides);
              }
              swipeStartX.current = null;
            }
          }}
        >
          <button
            type="button"
            className="ws-phone-nav is-prev"
            aria-label="Mẫu thiệp trước"
            onClick={() => setTemplateSlideIndex(current => (current - 1 + totalTemplateSlides) % totalTemplateSlides)}
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>

          <div className="ws-artframe-track">
            {templateSlides.map((slide, index) => {
              const { item } = slide;
              const diff = (index - activeTemplateSlideIndex + totalTemplateSlides) % totalTemplateSlides;
              const slot =
                diff === 0
                  ? "center"
                  : diff === 1
                  ? "right"
                  : diff === totalTemplateSlides - 1
                  ? "left"
                  : diff <= Math.floor(totalTemplateSlides / 2)
                  ? "far-right"
                  : "far-left";
              const isCenter = slot === "center";
              return (
                <article
                  key={slide.key}
                  className="ws-artframe-slide"
                  data-slot={slot}
                  aria-hidden={!isCenter && slot !== "left" && slot !== "right"}
                >
                  <div className="ws-artframe-device">
                    <div className="ws-artframe-mat">
                      <div className="ws-artframe-canvas">
                        <span className={`ws-card-badge ${item.templateNumber || item.tag !== "New" ? "" : "is-new"}`}>
                          {item.templateNumber ? `TEMPLATE ${String(item.templateNumber).padStart(2, "0")}` : item.tag}
                        </span>
                        <button
                          type="button"
                          className="ws-card-save"
                          aria-label={`${saved.includes(item.id) ? "Bỏ lưu" : "Lưu"} ${item.name}`}
                          aria-pressed={saved.includes(item.id)}
                          tabIndex={isCenter ? 0 : -1}
                          onClick={event => {
                            event.stopPropagation();
                            setSaved(prev => prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]);
                          }}
                        >
                          <Heart size={16} fill={saved.includes(item.id) ? "currentColor" : "none"} />
                        </button>
                        <button
                          type="button"
                          className="ws-art-button"
                          aria-label={isCenter ? `Xem nhanh ${item.name}` : `Chuyển đến ${item.name}`}
                          tabIndex={isCenter || slot === "left" || slot === "right" ? 0 : -1}
                          onClick={() => {
                            if (isCenter) openQuick(item);
                            else setTemplateSlideIndex(index);
                          }}
                        >
                          {item.template || item.coverImage ? (
                            <div className="ws-live-cover">
                              <Image
                                src={item.template?.coverImage ?? item.coverImage!}
                                fill
                                sizes="(max-width: 600px) 85vw, 420px"
                                quality={95}
                                unoptimized={Boolean(item.coverImage)}
                                alt={`Mẫu thiệp ${item.name}`}
                              />
                              <div>
                                <small>{item.template || item.templateNumber ? "THE WEDDING OF" : "KISMET LOVE"}</small>
                                <span>{item.template?.coupleName ?? item.coupleName ?? item.name}</span>
                                <small>{item.name}</small>
                              </div>
                            </div>
                          ) : (
                            <div className={`ws-flatlay ws-flatlay-${item.motif}`}>
                              <span className="ws-flatlay-envelope" />
                              <span className="ws-flatlay-extra"><SuiteArtwork part={1} item={item} /></span>
                              <span className="ws-flatlay-main"><InvitationArtwork item={item} /></span>
                              <Leaf className="ws-flatlay-leaf" size={70} strokeWidth={0.7} />
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            className="ws-phone-nav is-next"
            aria-label="Mẫu thiệp tiếp theo"
            onClick={() => setTemplateSlideIndex(current => (current + 1) % totalTemplateSlides)}
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="ws-template-active-info" key={activeTemplate.id} aria-live="polite">
          <div className="ws-template-active-meta">
            <span>
              {activeTemplate.templateNumber
                ? `TEMPLATE ${String(activeTemplate.templateNumber).padStart(2, "0")} · ${activeTemplate.style} · ${PACKAGES.find(pack => pack.id === activeTemplate.packageId)?.name}`
                : `${activeTemplate.style} · ${PACKAGES.find(pack => pack.id === activeTemplate.packageId)?.name}`}
            </span>
            {!activeTemplate.template && <strong className="ws-project-price">{activeTemplate.price}</strong>}
            {!activeTemplate.previewOnly && (
              <div className="ws-swatches">
                {(activeTemplate.template?.colors ?? [activeTemplate.background, activeTemplate.color, "#D1C4B8"]).map(color => (
                  <i key={color} style={{ background: color }} />
                ))}
              </div>
            )}
          </div>
          <h3>
            <button type="button" onClick={() => openQuick(activeTemplate)}>{activeTemplate.name}</button>
          </h3>
          {(activeTemplate.template?.coupleName ?? activeTemplate.coupleName) && (
            <p className="ws-template-active-couple">
              {activeTemplate.template?.coupleName ?? activeTemplate.coupleName}
              {activeTemplate.venue ? ` · ${activeTemplate.venue}` : ""}
            </p>
          )}
          <p className="ws-template-active-desc">
            {activeTemplate.description ?? activeTemplate.template?.description ?? "Một thiết kế nhẹ nhàng, có thể tùy chỉnh nội dung, hình ảnh và nhạc nền theo câu chuyện của hai bạn."}
          </p>
          <div className="ws-card-tags ws-template-active-tags">
            {activeTemplate.tags.map(tag => <span key={tag}>{tag}</span>)}
          </div>
          <div className="ws-template-active-actions">
            {activeTemplate.previewOnly ? (
              <span>Phần phong cách đang cập nhật</span>
            ) : activeTemplate.template ? (
              <>
                {activeTemplate.template.liveDemoUrl && (
                  <a className="ws-text-link" href={activeTemplate.template.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                    Xem bản xem trước <ExternalLink size={13} />
                  </a>
                )}
                {!activeTemplate.template.isRealProject && activeTemplate.template.tryUrl ? (
                  <Link className="ws-primary" href={activeTemplate.template.tryUrl}>
                    Thử mẫu này <ArrowRight size={14} />
                  </Link>
                ) : (
                  <button type="button" className="ws-primary" onClick={() => setConsultation(activeTemplate)}>
                    Tư vấn riêng <ArrowRight size={14} />
                  </button>
                )}
                <button type="button" className="ws-text-link" onClick={() => openQuick(activeTemplate)}>
                  Xem nhanh <ArrowRight size={13} />
                </button>
              </>
            ) : (
              <>
                <Link className="ws-primary" href={`/design?template=${activeTemplate.id}`}>
                  Tự chỉnh sửa <ArrowRight size={14} />
                </Link>
                <span>SVG · 2 mặt</span>
              </>
            )}
          </div>
          <div className="ws-phone-dots" role="tablist" aria-label="Chọn mẫu thiệp">
            {filtered.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={activeTemplateSlide?.realIndex === idx}
                aria-label={`Mẫu ${item.name}`}
                className={activeTemplateSlide?.realIndex === idx ? "is-active" : undefined}
                onClick={() => setTemplateSlideIndex(idx)}
              />
            ))}
          </div>
        </div>
      </div>}
      {!filtered.length && <div className="ws-empty"><Search size={28} strokeWidth={1} /><h3>Chưa có mẫu phù hợp</h3><p>{savedOnly ? "Lưu những mẫu bạn yêu thích bằng nút trái tim để xem lại ở đây" : "Thử chọn một chủ đề khác hoặc bỏ bớt thẻ đang chọn nhé"}</p><button className="ws-primary" onClick={reset}>Xem tất cả mẫu <ArrowRight size={14} /></button></div>}
      <div className="ws-catalog-note"><span><Check size={14} /> Các mẫu thiệp có thể chỉnh sửa mở trong editor miễn phí</span><span>Website RSVP & VietQR được cung cấp theo gói dịch vụ</span></div>
    </section>

    <PricingSection currency={currency} />

    <section className="ws-suite-section" aria-labelledby="suite-title"><div className="ws-suite ws-wrap"><div className="ws-suite-visual"><div className="ws-suite-shadow" /><div className="ws-suite-card"><SuiteArtwork part={suitePart} item={suiteItem} /></div><span className="ws-art-note">beautifully together, just like you</span></div><div className="ws-suite-copy"><p className="ws-kicker">EVERY DETAIL, IN HARMONY</p><h2 id="suite-title">Một câu chuyện<br /><em>Một bộ thiệp đồng điệu</em></h2><p>Từ lời mời đầu tiên đến chiếc thẻ trên bàn tiệc, từng chi tiết cùng mang một sắc màu, một tinh thần, một dấu ấn của hai bạn</p><div className="ws-suite-tabs" role="group" aria-label="Xem từng món trong bộ thiệp">{suiteParts.map((part, index) => <button key={part} aria-pressed={suitePart === index} onClick={() => setSuitePart(index)}>{index === 0 ? <Mail size={18} /> : index === 1 ? <Check size={18} /> : index === 2 ? <Sparkles size={18} /> : index === 3 ? <Leaf size={18} /> : <Heart size={18} />}<span>{part}</span></button>)}</div><p className="ws-suite-caption" role="status">Đang xem: {suiteParts[suitePart]} · {suiteItem.name}</p><Link className="ws-text-link" href={`/design?template=${suiteItem.id}`}>Tự chỉnh sửa thiệp mời <ArrowRight size={15} /></Link></div></div></section>

    <section className="ws-how ws-wrap" id="quy-trinh" aria-labelledby="how-title"><p className="ws-kicker">A LITTLE EASIER, A LOT MORE YOU</p><h2 id="how-title">Lời mời đẹp, <em>chỉ trong ba bước</em></h2><div className="ws-steps">{[{ icon: <Search size={24} />, title: "Chọn một thiết kế", text: "Tìm phong cách đồng điệu với ngày cưới và câu chuyện của hai bạn" }, { icon: <Paintbrush size={24} />, title: "Viết dấu ấn riêng", text: "Thay tên, nội dung, font và màu sắc Kéo chữ đến vị trí bạn muốn" }, { icon: <Mail size={24} />, title: "Gửi lời thương", text: "Tải SVG cho thiệp tĩnh, hoặc đặt website thiệp cưới để gửi link đến khách mời" }].map((step, index) => <article key={step.title}><span className="ws-step-number">0{index + 1}</span><div className="ws-step-icon">{step.icon}</div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div><Link className="ws-primary" href="/design">Thử thiết kế một chiếc thiệp <ArrowRight size={15} /></Link></section>

    <section className="ws-editor-promo ws-wrap"><div><span className="ws-kicker"><Paintbrush size={13} /> MADE BY YOU, WITH LOVE</span><h2>Tự tay viết<br /><em>Tự do sáng tạo</em></h2><p>Không cần cài đặt Không cần kinh nghiệm thiết kế<br />Một chiếc thiệp của riêng bạn, ngay trong trình duyệt</p><ul><li><Check size={13} /> Chỉnh chữ, font, màu & vị trí</li><li><Check size={13} /> Xem hai mặt, phóng to & tải SVG</li><li><Check size={13} /> Bản nháp tự lưu trên thiết bị</li></ul><Link href="/design" className="ws-primary">Mở trình thiết kế <ArrowRight size={15} /></Link><Link className="ws-text-link" href="/thu-thiep">Hoặc thử thay ảnh vào website thiệp cưới <ArrowRight size={13} /></Link></div><div className="ws-editor-mockup"><div className="ws-mockup-bar"><span>kIsmet <em>studio</em></span><span><Check size={11} /> Bản nháp trên thiết bị</span></div><div className="ws-mockup-body"><div className="ws-mockup-tools"><Paintbrush size={18} /><span>Aa</span><Leaf size={18} /><span className="ws-color-dot" /></div><div className="ws-mockup-card"><InvitationArtwork item={items[2]} /></div><span className="ws-mockup-cursor"><MousePointer2 size={18} fill="#59644f" /> your lovely idea</span></div></div></section>

    <StoreReviews />
    <section className="ws-faq ws-wrap" id="hoi-dap"><div><p className="ws-kicker">BEFORE WE BEGIN</p><h2>Một chút <em>giải đáp</em></h2><ConsultationButton className="ws-text-link">Trò chuyện cùng studio <ArrowRight size={14} /></ConsultationButton></div><div>{[
      ["Editor miễn phí có những gì?", "Bạn có thể thay chữ, font, màu nền, thêm hoặc xóa lớp chữ, kéo thả vị trí, xem hai mặt và tải bản SVG Bản nháp được lưu trong trình duyệt trên thiết bị hiện tại"],
      ["Thiệp tĩnh và website thiệp cưới khác nhau thế nào?", "Thiệp tĩnh là thiết kế SVG bạn có thể tải về và dùng như stationery Website thiệp cưới là lời mời trực tuyến có album ảnh, nhạc nền, bản đồ, RSVP và VietQR tùy gói dịch vụ Các tính năng này không được tích hợp trong file SVG"],
      ["Mình có thể thử ảnh trước khi đặt website thiệp cưới không?", "Có Chọn mẫu Standard hoặc Premium rồi bấm Thử mẫu này để mở trình tùy chỉnh ảnh, thông tin ngày cưới và màu dresscode hiện có"],
      ["Bản nháp có được lưu trên đám mây không?", "Bản nháp tự lưu trên thiết bị Trong trình thiết kế, bấm Lưu lên đám mây để bật tự đồng bộ vào MongoDB Bản đám mây gắn với cookie của phiên trình duyệt hiện tại, chưa hỗ trợ đăng nhập đa thiết bị Bạn có thể tải SVG để giữ bản thiết kế"],
      ["Làm thế nào để đặt mẫu Customized?", "Liên hệ studio để thống nhất concept, nội dung, hiệu ứng và phạm vi chỉnh sửa Đội ngũ sẽ tư vấn gói phù hợp trước khi bắt đầu thiết kế riêng"],
    ].map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>

    <section className="ws-newsletter"><div className="ws-wrap"><div><span className="ws-kicker">LET LOVE FIND YOUR INBOX</span><h2>Một chút cảm hứng<br /><em>Một chút lời thương</em></h2><p>Nhận mẫu mới, ý tưởng cho ngày cưới và ưu đãi từ kIsmet love</p></div><form onSubmit={subscribe}><label className="ws-email-label" htmlFor="newsletter-email">Email của bạn</label><div className="ws-email-row"><input id="newsletter-email" type="email" name="email" autoComplete="email" placeholder="you@lovestory.com" maxLength={254} required disabled={newsletterState === "sending"} /><button type="submit" disabled={newsletterState === "sending"}>{newsletterState === "sending" ? "Đang gửi…" : "Đăng ký"}<ArrowRight size={17} /></button></div><div className="ws-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div><label className="ws-consent"><input name="consent" type="checkbox" required /> Tôi đồng ý nhận bản tin và lưu email theo <button type="button" onClick={() => setInfo("privacy")}>chính sách riêng tư</button></label><p role="status" className="ws-form-status">{newsletterMessage}</p></form></div></section>
    <footer className="ws-footer ws-wrap"><div className="ws-footer-main"><div><Link href="/" className="ws-brand">kIsmet <em>love</em><span>WEDDING & LITTLE THINGS</span></Link><p>Lưu một ngày<br /><em>Nhớ một đời</em></p></div><div><h3>Bộ sưu tập</h3>{PACKAGES.map(pack => <button key={pack.id} onClick={() => choosePackage(pack.id)}>{pack.name}</button>)}</div><div><h3>Cùng bạn bắt đầu</h3><Link href="/design">Tự thiết kế thiệp</Link><Link href="/thu-thiep">Thử ảnh cưới</Link><a href="#bang-gia">Các gói & bảng giá</a><a href="#kho-mau-thiep">Kho mẫu & cảm hứng</a><a href="#du-an-thiep">Dự án thật</a><a href="#quy-trinh">Hướng dẫn cơ bản</a><a href="#hoi-dap">Câu hỏi thường gặp</a><button onClick={() => setInfo("terms")}>Điều khoản sử dụng</button><button onClick={() => setInfo("privacy")}>Chính sách riêng tư</button></div><div><h3>Gửi lời thương</h3>{CONTACT_PHONES.map(phone => <a key={phone.number} href={phone.zaloUrl} target="_blank" rel="noopener noreferrer" title={`Nhắn Zalo: ${phone.label}`}>{phone.label}</a>)}<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><ConsultationButton className="ws-text-link">Liên hệ studio <ArrowRight size={13} /></ConsultationButton><span className="ws-footer-palette">{["#FBF6F3", "#D1C4B8", "#B7A895", "#D1D9C8", "#EFC7C2"].map(color => <i key={color} style={{ background: color }} />)}</span></div></div><div className="ws-footer-bottom"><span>© 2026 kIsmet love</span><span>MADE WITH A LITTLE <Heart size={11} /> & A LOT OF LOVE</span><a href="#top">Về đầu trang ↑</a></div></footer>

    <dialog ref={quickDialog} className="ws-dialog ws-quick-dialog" onCancel={() => setQuickView(null)} onClick={e => { if (e.target === e.currentTarget) setQuickView(null); }} onClose={() => setQuickView(null)}>{quickView && <><button autoFocus className="ws-dialog-close" aria-label="Đóng xem nhanh" onClick={() => setQuickView(null)}><X size={20} /></button><div className="ws-quick-art">{quickView.coverImage || quickView.template ? <ProjectArtwork item={quickView} /> : <InvitationArtwork item={quickView} side={side} />}{!quickView.template && !quickView.previewOnly && <div className="ws-face-tabs"><button aria-pressed={side === "front"} onClick={() => setSide("front")}>Mặt trước</button><button aria-pressed={side === "back"} onClick={() => setSide("back")}>Mặt sau</button></div>}</div><div className="ws-quick-info"><p className="ws-kicker">{quickView.templateNumber ? `TEMPLATE ${String(quickView.templateNumber).padStart(2, "0")}` : quickView.previewOnly ? `TEMPLATE ${String(quickView.templateNumber ?? "").padStart(2, "0")}` : `${quickView.style} · ${PACKAGES.find(pack => pack.id === quickView.packageId)?.name}`}</p><h2>{quickView.name}</h2><p>{quickView.description ?? quickView.template?.description ?? "Một thiết kế stationery nhẹ nhàng, có thể thay chữ, font và màu để hòa cùng concept của hai bạn"}</p>{quickView.coupleName && <p>{quickView.coupleName}{quickView.venue ? ` · ${quickView.venue}` : ""}</p>}<div className="ws-card-tags">{quickView.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{!quickView.template && <strong>{quickView.price}</strong>}{quickView.previewOnly ? <p className="ws-small-note">Phần phong cách thiệp đang được cập nhật.</p> : quickView.template ? <>{quickView.template.liveDemoUrl && <a className="ws-primary" href={quickView.template.liveDemoUrl} target="_blank" rel="noopener noreferrer" onClick={() => setQuickView(null)}>Xem bản xem trước <ExternalLink size={14} /></a>}{!quickView.template.isRealProject && quickView.template.tryUrl && <Link className="ws-secondary" href={quickView.template.tryUrl}>Thử mẫu này <ArrowRight size={14} /></Link>}<button className="ws-text-link" onClick={() => { setConsultation(quickView); setQuickView(null); }}>Liên hệ đặt mẫu <ArrowRight size={14} /></button></> : <><Link className="ws-primary" href={`/design?template=${quickView.id}`}>Tự chỉnh sửa <Paintbrush size={14} /></Link><p className="ws-small-note">Chỉnh sửa miễn phí · Tải SVG · Lưu bản nháp trên thiết bị</p></>}</div></>}</dialog>
    <dialog ref={infoDialog} className="ws-dialog ws-info-dialog" onCancel={() => setInfo(null)} onClose={() => setInfo(null)} onClick={e => { if (e.target === e.currentTarget) setInfo(null); }}><button autoFocus className="ws-dialog-close" aria-label="Đóng" onClick={() => setInfo(null)}><X size={20} /></button>{info === "drafts" ? <><p className="ws-kicker">YOUR LITTLE CREATIONS</p><h2>Bản thiết kế của bạn</h2><p>Bản nháp được lưu trên thiết bị và trình duyệt này</p>{drafts.length ? drafts.map(draft => <Link className="ws-draft-link" key={draft.id} href={`/design?template=${draft.id}`}>{draft.name}<ArrowRight size={15} /></Link>) : <p>Bạn chưa có bản nháp Chọn một mẫu và mở editor để bắt đầu</p>}<Link className="ws-primary" href="/design">Tạo bản thiết kế <ArrowRight size={14} /></Link></> : info === "privacy" ? <><h2>Chính sách riêng tư</h2><p>Email và thời điểm đồng ý nhận bản tin được lưu trong cơ sở dữ liệu của kIsmet love để gửi thông tin về mẫu mới, ý tưởng và ưu đãi Chúng tôi không thu thập ảnh hay bản thiết kế thông qua form đăng ký này</p><p>Mẫu yêu thích và bản nháp editor được lưu trong trình duyệt trên thiết bị của bạn Xóa dữ liệu trang web sẽ xóa các bản nháp này</p><p>Bạn có thể yêu cầu xóa email hoặc ngừng nhận bản tin qua email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> hoặc số liên hệ của studio ở cuối trang</p></> : <><h2>Điều khoản sử dụng</h2><p>Editor stationery cho phép chỉnh sửa và tải SVG cho nhu cầu cá nhân Bạn chịu trách nhiệm về quyền sử dụng nội dung được thêm vào thiết kế</p><p>Dịch vụ website thiệp cưới và thiết kế riêng cần thống nhất giá, thời gian giao, hosting và phạm vi chỉnh sửa với studio trước khi đặt Các mẫu stationery miễn phí không bao gồm website RSVP, VietQR hay nhạc nền</p><p>Bản nháp trên thiết bị không thay thế bản sao lưu Hãy tải SVG để giữ thiết kế hoàn thiện</p></>}</dialog>
    <ZaloContactDock />
    {consultation && <ConsultationDialog templateName={consultation.name} packageName={PACKAGES.find(pack => pack.id === consultation.packageId)?.name} onClose={() => setConsultation(null)} />}
  </main>;
}







