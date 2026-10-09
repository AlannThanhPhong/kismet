"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MessageCircle, X } from "lucide-react";
import { CONTACT_PHONES } from "@/lib/contact";

export default function ZaloContactDock() {
  const [open, setOpen] = useState(false);
  const dockRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !dockRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return <aside ref={dockRef} className="ws-zalo-dock" aria-label="Liên hệ tư vấn">
    {open && <div id="ws-zalo-contacts" className="ws-zalo-panel">
      <div className="ws-zalo-heading"><span>Trò chuyện cùng <em>kIsmet love</em></span><small>Chọn số để nhắn Zalo</small></div>
      {CONTACT_PHONES.map(phone => <a key={phone.number} href={phone.zaloUrl} target="_blank" rel="noopener noreferrer" aria-label={`Nhắn Zalo: ${phone.label}`}>
        <span>{phone.label.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}</span><ArrowUpRight size={17} aria-hidden="true" />
      </a>)}
    </div>}
    <button ref={triggerRef} type="button" className="ws-zalo-trigger" aria-expanded={open} aria-controls={open ? "ws-zalo-contacts" : undefined} onClick={() => setOpen(value => !value)}>
      <span className="ws-zalo-icon">{open ? <X size={18} aria-hidden="true" /> : <MessageCircle size={18} aria-hidden="true" />}</span>
      <span>{open ? "Đóng liên hệ" : "Nhắn Zalo"}</span>
    </button>
  </aside>;
}
