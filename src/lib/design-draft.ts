import type { InvitationLayer } from "@/app/components/InvitationArtwork";

export type DesignDraft = { layers: InvitationLayer[]; background: string };
export function validDraft(value: unknown): value is DesignDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as DesignDraft;
  const color = (x: unknown) => typeof x === "string" && /^#[0-9a-f]{6}$/i.test(x);
  return color(draft.background) && Array.isArray(draft.layers) && draft.layers.length > 0 && draft.layers.length <= 40 && new Set(draft.layers.map(layer => layer?.id)).size === draft.layers.length && draft.layers.every(layer => layer && typeof layer.id === "string" && layer.id.length <= 80 && typeof layer.text === "string" && layer.text.length <= 300 && Number.isFinite(layer.x) && layer.x >= 0 && layer.x <= 400 && Number.isFinite(layer.y) && layer.y >= 0 && layer.y <= 540 && Number.isFinite(layer.size) && layer.size >= 8 && layer.size <= 80 && color(layer.color) && ["serif", "sans", "script"].includes(layer.font) && ["front", "back"].includes(layer.side));
}
