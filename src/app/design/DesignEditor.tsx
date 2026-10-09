"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Download, Layers, Plus, RotateCcw, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import { getCatalog } from "@/lib/storefront-catalog";
import { validDraft, type DesignDraft } from "@/lib/design-draft";
import InvitationArtwork, { initialLayers, type InvitationLayer } from "../components/InvitationArtwork";

export default function DesignEditor() {
  const params = useSearchParams();
  const item = useMemo(() => { const items = getCatalog("VND").filter(item => !item.template); return items.find(item => item.id === params.get("template")) ?? items[0]; }, [params]);
  // Remount when switching templates so one design never overwrites another.
  return <Editor key={item.id} item={item} />;
}

function Editor({ item }: { item: ReturnType<typeof getCatalog>[number] }) {
  const [draft, setDraft] = useState<DesignDraft>({ layers: initialLayers(item), background: item.background });
  const [side, setSide] = useState<"front" | "back">("front");
  const [selected, setSelected] = useState("front-1");
  const [zoom, setZoom] = useState(1);
  const [ready, setReady] = useState(false);
  const [saveMessage, setSaveMessage] = useState("Đang tải bản nháp…");
  const [cloudMessage, setCloudMessage] = useState("");
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudEnabled, setCloudEnabled] = useState(false);
  const canvas = useRef<HTMLDivElement>(null);
  const dirty = useRef(false);
  const latestDraft = useRef(draft);
  latestDraft.current = draft;
  const drag = useRef<{ id: string; startX: number; startY: number; x: number; y: number; svg: SVGSVGElement } | null>(null);
  const key = `kismet-design-v1-${item.id}`;
  const current = draft.layers.find(layer => layer.id === selected);

  useEffect(() => {
    try { const value: unknown = JSON.parse(localStorage.getItem(key) ?? "null"); if (validDraft(value)) setDraft(value); }
    catch { setSaveMessage("Không thể đọc bản nháp trên thiết bị."); }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    setSaveMessage("Đang lưu trên thiết bị…");
    const timer = setTimeout(() => {
      try { localStorage.setItem(key, JSON.stringify(draft)); setSaveMessage("Đã lưu trên thiết bị"); }
      catch { setSaveMessage("Không thể lưu. Hãy tải SVG để giữ thiết kế."); }
    }, 450);
    return () => clearTimeout(timer);
  }, [draft, ready, key]);
  useEffect(() => {
    if (!ready || !cloudEnabled || !dirty.current) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setCloudMessage("Đang tự lưu lên đám mây…");
      try {
        const response = await fetch(`/api/designs/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft), signal: controller.signal });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        if (!controller.signal.aborted) { dirty.current = false; setCloudMessage("Đã tự lưu lên đám mây"); }
      } catch (error) { if (!controller.signal.aborted) setCloudMessage(error instanceof Error ? error.message : "Chưa thể đồng bộ."); }
    }, 1200);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [draft, ready, cloudEnabled, item.id]);
  function change(next: DesignDraft | ((draft: DesignDraft) => DesignDraft)) { dirty.current = true; setCloudMessage(""); setDraft(next); }
  function update(patch: Partial<InvitationLayer>) { change(value => ({ ...value, layers: value.layers.map(layer => layer.id === selected ? { ...layer, ...patch } : layer) })); }
  function pointer(event: React.PointerEvent<SVGTextElement>, id: string) {
    if (event.button !== 0) return;
    const layer = draft.layers.find(layer => layer.id === id)!;
    const svg = event.currentTarget.ownerSVGElement!;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id, x: layer.x, y: layer.y, startX: event.clientX, startY: event.clientY, svg };
    setSelected(id);
  }
  function move(event: React.PointerEvent) {
    const active = drag.current;
    if (!active) return;
    const matrix = active.svg.getScreenCTM()?.inverse();
    if (!matrix) return;
    const start = new DOMPoint(active.startX, active.startY).matrixTransform(matrix);
    const end = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix);
    change(value => ({ ...value, layers: value.layers.map(layer => layer.id === active.id ? { ...layer, x: Math.max(0, Math.min(400, active.x + end.x - start.x)), y: Math.max(0, Math.min(540, active.y + end.y - start.y)) } : layer) }));
  }
  function add() {
    const id = crypto.randomUUID();
    change(value => ({ ...value, layers: [...value.layers, { id, text: "Viết lời thương…", x: 200, y: 270, size: 22, color: item.color, font: "serif", side }] })); setSelected(id);
  }
  function flip(next: "front" | "back") { setSide(next); setSelected(draft.layers.find(layer => layer.side === next)?.id ?? ""); }
  function exportSvg() {
    const source = canvas.current?.querySelector("svg")?.cloneNode(true) as SVGSVGElement | undefined;
    if (!source) return;
    source.setAttribute("xmlns", "http://www.w3.org/2000/svg"); source.setAttribute("width", "400"); source.setAttribute("height", "540");
    source.querySelectorAll("text").forEach(text => { text.removeAttribute("stroke"); text.removeAttribute("stroke-width"); text.removeAttribute("style"); if (text.getAttribute("font-family")?.includes("kIsmet")) text.setAttribute("font-family", "cursive"); });
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(source)], { type: "image/svg+xml;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `${item.id}-${side}.svg`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function cloud(action: "save" | "load") {
    const sentDraft = draft;
    setCloudLoading(true); setCloudMessage(action === "save" ? "Đang lưu lên đám mây…" : "Đang tải bản trên đám mây…");
    try {
      const response = await fetch(`/api/designs/${item.id}`, action === "save" ? { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) } : { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Chưa thể đồng bộ. Vui lòng thử lại.");
      if (latestDraft.current !== sentDraft) { setCloudMessage("Thiết kế vừa thay đổi. Hãy lưu bản mới để đồng bộ."); return; }
      if (action === "load") { if (!validDraft(result.draft)) throw new Error("Bản nháp không hợp lệ."); setDraft(result.draft); setSelected(result.draft.layers.find((layer: InvitationLayer) => layer.side === side)?.id ?? ""); }
      dirty.current = false; setCloudEnabled(true); setCloudMessage(action === "save" ? "Đã lưu lên đám mây · Tự lưu đã bật" : "Đã tải bản nháp từ đám mây");
    } catch (error) { setCloudMessage(error instanceof Error ? error.message : "Kết nối bị gián đoạn."); }
    finally { setCloudLoading(false); }
  }
  return <main className="design-studio">
    <header className="ds-header"><Link href="/#kho-mau-thiep"><ArrowLeft size={16} /> Kho mẫu</Link><div><span className="ws-brand">kIsmet <em>love</em></span><p>{item.name} · Bàn thiết kế của bạn</p></div><button className="ws-primary" onClick={exportSvg} disabled={!ready}><Download size={15} /> Tải SVG</button></header>
    <div className="ds-save-row" role="status"><Check size={13} /> {saveMessage}{cloudMessage && <span>{cloudMessage}</span>}</div>
    <div className="ds-layout">
      <aside className="ds-panel"><p className="ws-kicker">TỪNG CHI TIẾT, THEO Ý BẠN</p><h2>Chỉnh sửa thiệp</h2>{current ? <>
        <label>Nội dung chữ<textarea value={current.text} maxLength={300} onChange={event => update({ text: event.target.value })} /></label>
        <label>Phông chữ<select value={current.font} onChange={event => update({ font: event.target.value })}><option value="serif">Thanh lịch · Georgia</option><option value="sans">Hiện đại · Arial</option><option value="script">Viết tay · Cursive</option></select></label>
        <div className="ds-fields"><label>Cỡ chữ<input type="number" min={8} max={80} value={current.size} onChange={event => update({ size: Math.max(8, Math.min(80, Number(event.target.value) || 8)) })} /></label><label>Màu chữ<input type="color" value={current.color} onChange={event => update({ color: event.target.value })} /></label></div>
        <div className="ds-fields"><label>Vị trí ngang<input type="number" min={0} max={400} value={Math.round(current.x)} onChange={event => update({ x: Math.max(0, Math.min(400, Number(event.target.value))) })} /></label><label>Vị trí dọc<input type="number" min={0} max={540} value={Math.round(current.y)} onChange={event => update({ y: Math.max(0, Math.min(540, Number(event.target.value))) })} /></label></div>
        <button className="ds-delete" disabled={draft.layers.length <= 1} onClick={() => { change(value => ({ ...value, layers: value.layers.filter(layer => layer.id !== selected) })); setSelected(""); }}><Trash2 size={14} /> Xóa lớp chữ</button>
      </> : <p>Chọn một dòng chữ trên thiệp hoặc trong danh sách lớp để chỉnh sửa.</p>}
        <label>Màu nền<input type="color" value={draft.background} onChange={event => change(value => ({ ...value, background: event.target.value }))} /></label>
        <div className="ds-palette">{["#FBF6F3", "#D1C4B8", "#B7A895", "#D1D9C8", "#EFC7C2"].map(color => <button key={color} aria-label={`Nền ${color}`} style={{ background: color }} onClick={() => change(value => ({ ...value, background: color }))} />)}</div>
        <button className="ds-outline" onClick={add} disabled={draft.layers.length >= 40}><Plus size={15} /> Thêm chữ</button>
      </aside>
      <section className="ds-workspace" aria-label="Khung thiết kế"><div className="ds-canvas-tools"><div>{(["front", "back"] as const).map(face => <button key={face} aria-pressed={side === face} onClick={() => flip(face)}>{face === "front" ? "Mặt trước" : "Mặt sau"}</button>)}</div><div><button aria-label="Thu nhỏ" onClick={() => setZoom(value => Math.max(.5, value - .1))}><ZoomOut size={17} /></button><span>{Math.round(zoom * 100)}%</span><button aria-label="Phóng to" onClick={() => setZoom(value => Math.min(1.5, value + .1))}><ZoomIn size={17} /></button></div></div>
        <div className="ds-canvas-scroll"><div ref={canvas} className="ds-canvas" style={{ width: 360 * zoom }} onPointerMove={move} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}><InvitationArtwork item={item} layers={draft.layers} side={side} background={draft.background} selected={selected} onSelect={setSelected} onPointerDown={pointer} /></div></div><p className="ds-hint">Chạm vào chữ để chọn · Kéo chữ để đổi vị trí · Sửa nội dung ở bảng bên trái</p>
      </section>
      <aside className="ds-panel ds-layers"><p className="ws-kicker"><Layers size={13} /> CÁC LỚP THIẾT KẾ</p><h2>{side === "front" ? "Mặt trước" : "Mặt sau"}</h2><div className="ds-layer-list">{draft.layers.filter(layer => layer.side === side).map(layer => <button key={layer.id} aria-pressed={selected === layer.id} onClick={() => setSelected(layer.id)}><span>T</span>{layer.text || "Chữ trống"}</button>)}</div>
        <div className="ds-cloud"><h3>Bản nháp đám mây</h3><p>Bản nháp gắn với phiên trình duyệt này. Lưu trước khi tải lại để giữ thay đổi.</p><button className="ds-outline" disabled={!ready || cloudLoading} onClick={() => cloud("save")}>Lưu lên đám mây</button><button className="ds-outline" disabled={!ready || cloudLoading || dirty.current} onClick={() => cloud("load")}>Tải bản đã lưu</button></div>
        <button className="ds-outline" onClick={() => { change({ layers: initialLayers(item), background: item.background }); setSelected("front-1"); setSide("front"); }}><RotateCcw size={14} /> Dùng lại bố cục gốc</button><p className="ds-note">SVG là thiệp tĩnh. Chọn Standard hoặc Premium trong kho mẫu nếu cần website có RSVP, nhạc và bản đồ.</p>
      </aside>
    </div>
  </main>;
}
