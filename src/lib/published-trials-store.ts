export interface PublishedTrialPayload {
  id: string;
  templateCode: string;
  title?: string;
  imageMap: Record<string, string>;
  textMap: Record<string, string>;
  musicSrc?: string;
  musicTitle?: string;
  createdAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __kismetPublishedTrials: Map<string, PublishedTrialPayload> | undefined;
}

export function getMemoryTrialStore(): Map<string, PublishedTrialPayload> {
  if (!globalThis.__kismetPublishedTrials) {
    globalThis.__kismetPublishedTrials = new Map<string, PublishedTrialPayload>();
  }
  return globalThis.__kismetPublishedTrials;
}
