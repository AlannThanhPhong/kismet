"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, Phone, X } from "lucide-react";
import { CONTACT_PHONES } from "@/lib/contact";
import "./consultation.css";

interface ConsultationContext {
  templateName?: string;
  packageName?: string;
}

interface ConsultationButtonProps extends ConsultationContext {
  children: ReactNode;
  className?: string;
}

interface ConsultationDialogProps extends ConsultationContext {
  onClose: () => void;
}

export function ConsultationDialog({ onClose, templateName, packageName }: ConsultationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef(onClose);
  const titleId = useId();
  const descriptionId = useId();
  closeRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const body = document.body;
    const previousStyle = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbarWidth}px`;
    }
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = `-${scrollX}px`;
    body.style.width = "100%";
    dialog.showModal();
    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      Object.assign(body.style, previousStyle);
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  const context = [templateName && `Mẫu ${templateName}`, packageName].filter(Boolean).join(" · ");
  const message = context
    ? `Mình muốn được tư vấn thiệp cưới kIsmet love: ${context}.`
    : "Mình muốn được tư vấn thiết kế thiệp cưới kIsmet love";

  if (typeof document === "undefined") return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="consultation-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        closeRef.current();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
          closeRef.current();
        }
      }}
    >
      <button ref={closeButtonRef} type="button" className="consultation-close" onClick={onClose} aria-label="Đóng lựa chọn liên hệ">
        <X size={20} />
      </button>
      <p className="consultation-kicker">kIsmet love</p>
      <h2 id={titleId}>Mình cùng tạo thiệp nhé?</h2>
      <p id={descriptionId} className="consultation-description">Chọn một số điện thoại để gọi tư vấn hoặc nhắn qua Zalo</p>
      {context && <p className="consultation-context">{context}</p>}
      <div className="consultation-phone-list">
        {CONTACT_PHONES.map((phone) => (
          <a key={phone.number} href={`tel:${phone.number}`} className="consultation-phone">
            <Phone size={20} aria-hidden="true" />
            <span><small>Gọi tư vấn</small><strong>{phone.label}</strong></span>
          </a>
        ))}
      </div>
      {CONTACT_PHONES.map((phone) => (
        <a key={phone.number} className="consultation-zalo" href={`${phone.zaloUrl}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={20} aria-hidden="true" /> Nhắn Zalo: {phone.label}
        </a>
      ))}
      <p className="consultation-note">Tư vấn miễn phí, cùng bạn chọn mẫu phù hợp</p>
    </dialog>,
    document.body,
  );
}

export default function ConsultationButton({ children, className, templateName, packageName }: ConsultationButtonProps) {
  const [open, setOpen] = useState(false);

  return <>
    <button type="button" className={`consultation-trigger${className ? ` ${className}` : ""}`} aria-haspopup="dialog" onClick={() => setOpen(true)}>
      {children}
    </button>
    {open && <ConsultationDialog onClose={() => setOpen(false)} templateName={templateName} packageName={packageName} />}
  </>;
}
