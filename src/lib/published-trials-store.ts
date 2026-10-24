export interface PublishedTrialPayload {
  id: string;
  templateCode: string;
  title?: string;
  imageMap: Record<string, string>;
  textMap: Record<string, string>;
  musicSrc?: string;
  musicTitle?: string;
  createdAt: string;
  expiresAt?: string;
  ownerId?: string;
  ownerEmail?: string;
  renewedAt?: string;
  renewalCount?: number;
  disabledAt?: string;
}

export const PUBLISHED_TRIAL_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

export function getPublishedTrialExpiry(record: Pick<PublishedTrialPayload, "createdAt" | "expiresAt">) {
  if (record.expiresAt) {
    const expiry = new Date(record.expiresAt);
    if (Number.isFinite(expiry.getTime())) return expiry;
  }

  const createdAt = new Date(record.createdAt);
  if (!Number.isFinite(createdAt.getTime())) return null;
  return new Date(createdAt.getTime() + PUBLISHED_TRIAL_LIFETIME_MS);
}
