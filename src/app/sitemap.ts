import type { MetadataRoute } from "next";
import { INDEXABLE_PATHS, SITE_URL } from "@/lib/seo";
import { designedInvitations } from "@/lib/designed-invitations";
import { getDatabase } from "@/lib/mongodb";
import type { Invitation } from "@/lib/models";

// Read current invitations when requested, including invitations created after deployment.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const codes = new Set(designedInvitations.map((invitation) => invitation.code));

  if (process.env.MONGODB_URI) {
    try {
      const db = await getDatabase();
      const invitations = await db.collection<Invitation>("invitations")
        .find({}, { projection: { _id: 0, code: 1 } }).toArray();
      for (const invitation of invitations) {
        if (typeof invitation.code === "string" && invitation.code.trim()) {
          codes.add(invitation.code);
        }
      }
    } catch {
      // Keep the built-in invitations discoverable during a database outage.
      console.error("Sitemap: could not load MongoDB invitations; using built-in invitations.");
    }
  }

  // Do not invent lastModified dates: add them only from real content revisions.
  return [
    ...INDEXABLE_PATHS.map((path) => ({ url: new URL(path, SITE_URL).href })),
    ...Array.from(codes).sort().map((code) => ({
      url: `${SITE_URL}/thiep/${encodeURIComponent(code)}`,
    })),
  ];
}
