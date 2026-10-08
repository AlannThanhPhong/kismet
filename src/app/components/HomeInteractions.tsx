"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Heart, Menu, Pause, Play, X } from "lucide-react";

export function HomeEffects() {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".kismet-home");
    if (!root) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduced(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    root.classList.add("motion-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    root.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    const art = root.querySelector<HTMLElement>(".hero-art");
    let frame = 0;
    const pointer = (event: PointerEvent) => {
      if (!art || event.pointerType !== "mouse" || media.matches || pausedRef.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = art.getBoundingClientRect();
        art.style.setProperty("--drift-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 12}px`);
        art.style.setProperty("--drift-y", `${((event.clientY - rect.top) / rect.height - 0.5) * 10}px`);
      });
    };
    const reset = () => { art?.style.setProperty("--drift-x", "0px"); art?.style.setProperty("--drift-y", "0px"); };
    art?.addEventListener("pointermove", pointer);
    art?.addEventListener("pointerleave", reset);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      media.removeEventListener("change", updatePreference);
      art?.removeEventListener("pointermove", pointer);
      art?.removeEventListener("pointerleave", reset);
      root.classList.remove("motion-ready");
    };
  }, []);

  useEffect(() => {
    pausedRef.current = paused || reduced;
    const root = document.querySelector<HTMLElement>(".kismet-home");
    root?.setAttribute("data-motion", paused || reduced ? "paused" : "playing");
    if (paused || reduced) {
      root?.querySelector<HTMLElement>(".hero-art")?.style.setProperty("--drift-x", "0px");
      root?.querySelector<HTMLElement>(".hero-art")?.style.setProperty("--drift-y", "0px");
    }
  }, [paused, reduced]);

  return <button className="motion-toggle" onClick={() => setPaused(!paused)} aria-pressed={paused || reduced} disabled={reduced} aria-label={reduced ? "Chuyển động đã giảm theo cài đặt thiết bị" : paused ? "Bật hiệu ứng chuyển động" : "Tạm dừng hiệu ứng chuyển động"}>
    {paused || reduced ? <Play size={12} /> : <Pause size={12} />}<span>{reduced ? "Chuyển động đã giảm" : paused ? "Bật hiệu ứng" : "Dừng hiệu ứng"}</span>
  </button>;
}

const links = [{ href: "#danh-sach-thiep", title: "Những lời mời" }, { href: "#mau-thiep", title: "Cảm hứng" }, { href: "#loi-thuong", title: "Chuyện của kIsmet love" }];

export function HomeNavigation() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return <>
    <nav className="nav-links" aria-label="Điều hướng chính">{links.map(link => <a key={link.href} href={link.href}>{link.title}</a>)}</nav>
    <button className="mobile-menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Đóng menu" : "Mở menu"}>{open ? <X size={23} /> : <Menu size={23} />}</button>
    <nav className="mobile-navigation" id="mobile-navigation" hidden={!open} aria-label="Điều hướng di động">{links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.title}<ArrowRight size={18} /></a>)}<a href="#bat-dau" onClick={() => setOpen(false)}>Kể chuyện cùng kIsmet love <Heart size={17} /></a></nav>
  </>;
}

const moods = [
  { label: "Hoài niệm", title: "Một thước phim tình yêu.", description: "Ánh vàng, đỏ rượu và những khung hình có chút hạt phim. Dành cho một chuyện tình mang dư vị rất riêng.", image: "/home/images/nostalgic-wedding.jpg", code: "20260110-NHVVAM", name: "HONG KONG 1999", colors: ["#642634", "#b88756", "#eddbb5"], note: "a love like the movies", className: "nostalgic" },
  { label: "Trong trẻo", title: "Dịu dàng như lời hẹn đầu.", description: "Trắng ngà, xanh lá và một bó hoa nhỏ. Để hình ảnh của hai bạn kể câu chuyện nhẹ nhàng, tự nhiên nhất.", image: "/home/images/garden-wedding.jpg", code: "20261027-KHVT", name: "NGÀY MÌNH CHUNG ĐÔI", colors: ["#64715c", "#c7c9b7", "#f2eee3"], note: "simply, beautifully us", className: "airy" },
];

export function Moodboard() {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mood = moods[selected];
  return <div className={`moodboard mood-${mood.className}`}>
    <div className="mood-tabs" role="tablist" aria-label="Phong cách thiệp">{moods.map((item, i) => <button ref={element => { tabRefs.current[i] = element; }} id={`mood-tab-${i}`} key={item.label} role="tab" aria-selected={selected === i} aria-controls="mood-panel" tabIndex={selected === i ? 0 : -1} onClick={() => setSelected(i)} onKeyDown={event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? moods.length - 1 : (i + (event.key === "ArrowRight" ? 1 : -1) + moods.length) % moods.length;
      setSelected(next); tabRefs.current[next]?.focus();
    }}><span>0{i + 1}</span>{item.label}</button>)}</div>
    <div className="mood-panel" id="mood-panel" role="tabpanel" aria-labelledby={`mood-tab-${selected}`}>
      <div className="mood-photo" key={mood.image}><Image src={mood.image} alt={`Ảnh cưới trong phong cách ${mood.label.toLowerCase()}`} fill sizes="(max-width: 700px) 85vw, 35vw" /><span>{mood.note}</span></div>
      <div className="mood-description"><div className="mood-swatches" aria-label="Bảng màu cảm hứng">{mood.colors.map(color => <span key={color} style={{ background: color }} />)}</div><span className="mood-label">THE WEDDING EDIT / 0{selected + 1}</span><h3>{mood.title}</h3><p>{mood.description}</p><a className="text-link" href={`/thiep/${mood.code}`}>Mở {mood.name} <ArrowRight size={17} /></a><Heart className="mood-heart" size={56} strokeWidth={0.6} aria-hidden="true" /></div>
    </div>
  </div>;
}

export function LoveEnvelope() {
  const [open, setOpen] = useState(false);
  return <div className={`love-envelope${open ? " is-open" : ""}`}>
    <div className="envelope-letter" id="envelope-letter" aria-hidden={!open} inert={!open}><span>Dear you,</span><p>Mỗi chuyện tình đẹp<br />bắt đầu từ một lời chào.</p><a href="#danh-sach-thiep">Xem những lời mời <ArrowRight size={14} /></a></div>
    <div className="envelope-back" /><div className="envelope-flap" /><div className="envelope-front" />
    <button className="envelope-seal" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="envelope-letter" aria-label={open ? "Đóng thư từ kIsmet love" : "Mở thư từ kIsmet love"}><Heart size={22} strokeWidth={1} /></button>
    <span className="envelope-hint">{open ? "một lời chào, một khởi đầu mới." : "chạm vào trái tim để mở thư"}</span>
  </div>;
}
