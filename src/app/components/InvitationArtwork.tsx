import type { CatalogItem } from "@/lib/storefront-catalog";

export type InvitationLayer = { id: string; text: string; x: number; y: number; size: number; color: string; font: string; side: "front" | "back" };
export function initialLayers(item: CatalogItem): InvitationLayer[] {
  const text = item.type === "Menu" ? ["THE WEDDING MENU", "With love", "STARTER", "Seasonal garden salad", "MAIN COURSE", "Roasted salmon & herbs", "SOMETHING SWEET", "Vanilla wedding cake"] : item.type === "Sign" ? ["WELCOME TO", "Our forever", "AN & MINH", "We’re so glad you’re here", "24 OCTOBER 2026"] : [item.type === "Save the Date" ? "SAVE THE DATE" : "TOGETHER WITH OUR FAMILIES", "An & Minh", "INVITE YOU TO CELEBRATE", "the beginning of forever", "24 . 10 . 2026", "THE GARDEN · SAIGON"];
  return [...text.map((text, i) => ({ id: `front-${i}`, text, x: 200, y: item.type === "Menu" ? 95 + i * 43 : [115, 200, 264, 296, 365, 405][i], size: i === 1 ? 44 : i === 3 ? 18 : 11, color: item.color, font: "serif", side: "front" as const })), { id: "back-1", text: "A little note of love", x: 200, y: 170, size: 30, color: item.color, font: "serif", side: "back" as const }, { id: "back-2", text: "We can’t wait to celebrate with you", x: 200, y: 245, size: 16, color: item.color, font: "serif", side: "back" as const }, { id: "back-3", text: "Please RSVP by 10 October 2026", x: 200, y: 330, size: 12, color: item.color, font: "serif", side: "back" as const }];
}
export default function InvitationArtwork({ item, layers, side = "front", background, selected, onSelect, onPointerDown }: { item: CatalogItem; layers?: InvitationLayer[]; side?: "front" | "back"; background?: string; selected?: string; onSelect?: (id: string) => void; onPointerDown?: (event: React.PointerEvent<SVGTextElement>, id: string) => void }) {
  const baseFill = background ?? item.background;
  const uid = `card-${item.id}-${side}`;
  return <svg viewBox="0 0 400 540" xmlns="http://www.w3.org/2000/svg" className="invitation-artwork" role="img" aria-label={`Thiết kế ${item.name}, ${side === "front" ? "mặt trước" : "mặt sau"}`}>
    <defs>
      <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="400" y2="540" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.34" />
        <stop offset="48%" stopColor="#ffffff" stopOpacity="0.04" />
        <stop offset="100%" stopColor="#3c352c" stopOpacity="0.11" />
      </linearGradient>
      <filter id={`${uid}-grain`} x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="3" seed="14" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.28  0 0 0 0 0.23  0 0 0 0 0.18  0.13 0 0 0 -0.02" />
      </filter>
    </defs>
    <rect width="400" height="540" fill={baseFill} />
    <rect width="400" height="540" fill={`url(#${uid}-sheen)`} />
    <rect width="400" height="540" filter={`url(#${uid}-grain)`} opacity="0.9" />
    {/* Letterpress plate deboss impression */}
    <rect x="13" y="13" width="374" height="514" fill="none" stroke="#3c352c" strokeOpacity="0.12" strokeWidth="1" />
    <rect x="14" y="14" width="374" height="514" fill="none" stroke="#ffffff" strokeOpacity="0.65" strokeWidth="1" />
    {item.motif === "arch" ? <g fill="none"><path d="M36 500V193a164 164 0 0 1 328 0v307Z" stroke="#ffffff" strokeOpacity="0.55" transform="translate(0.8 0.8)" /><path d="M36 500V193a164 164 0 0 1 328 0v307Z" stroke={item.color} opacity=".45" /></g> : item.motif === "frame" ? <g fill="none"><rect x="24.8" y="24.8" width="352" height="492" stroke="#ffffff" strokeOpacity="0.55" /><rect x="24" y="24" width="352" height="492" stroke={item.color} opacity=".45" /><rect x="30" y="30" width="340" height="480" stroke={item.color} opacity=".38" /></g> : <g fill="none" stroke={item.color} strokeWidth="1.4" opacity=".58">{[0, 1].map(i => <g key={i} transform={i ? "translate(400 540) rotate(180)" : undefined}><path d="M20 165Q75 120 122 26" />{[0, 1, 2, 3, 4].map(j => <g key={j} transform={`translate(${36 + j * 17} ${140 - j * 24}) rotate(-28)`}><path d="M0 0Q-30-14-20-35Q8-21 0 0ZM0 0Q35 10 38-16Q14-23 0 0Z" /></g>)}</g>)}</g>}
    {(layers ?? initialLayers(item)).filter(layer => layer.side === side).map(layer => <text key={layer.id} x={layer.x} y={layer.y} textAnchor="middle" fill={layer.color} fontSize={layer.size} fontFamily={layer.font === "sans" ? "Arial, sans-serif" : layer.font === "script" ? "'kIsmet love Script', cursive" : "Georgia, serif"} fontStyle={layer.size > 25 ? "italic" : undefined} letterSpacing={layer.size < 14 ? 2 : 0} onClick={() => onSelect?.(layer.id)} onPointerDown={event => onPointerDown?.(event, layer.id)} style={onSelect ? { cursor: "move", touchAction: "none", userSelect: "none" } : undefined} stroke={selected === layer.id ? layer.color : undefined} strokeWidth={selected === layer.id ? .35 : undefined}>{layer.text}</text>)}
    <path d="M183 458q17-14 34 0m-34 0q17 14 34 0" stroke={item.color} fill="none" opacity=".6" />
  </svg>;
}
