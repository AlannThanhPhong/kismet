import { getDatabase } from "@/lib/mongodb";
import type { Invitation, Rsvp } from "@/lib/models";
import { designedInvitations } from "@/lib/designed-invitations";
import type { Filter } from "mongodb";

export async function getRsvpSummary(slug: string) {
  const db = await getDatabase();
  const invitation = await db.collection<Invitation>("invitations").findOne({ slug });
  if (!invitation) {
    return designedInvitations.some(item => item.slug === slug)
      ? { responses: 0, attending: 0, declined: 0, guests: 0, wishCount: 0, wishes: [], ...(slug === "20260823-NDTD" ? { entries: [] } : {}) }
      : null;
  }
  const responses = db.collection<Rsvp>("rsvps");
  // The password-protected guestbook includes every wish, including older responses.
  // Other invitations keep their existing opt-in policy.
  const wishFilter: Filter<Rsvp> = { invitationId: invitation._id,
    ...(slug === "20260823-NDTD" ? {} : { publishMessage: true }),
    message: { $type: "string", $ne: "" } };
  const [totals, wishCount, wishes, entries] = await Promise.all([
    responses.aggregate<{ responses: number; attending: number; declined: number; guests: number }>([
      { $match: { invitationId: invitation._id } },
      { $group: { _id: null, responses: { $sum: 1 }, attending: { $sum: { $cond: ["$attending", 1, 0] } },
        declined: { $sum: { $cond: ["$attending", 0, 1] } }, guests: { $sum: "$guestCount" } } },
      { $project: { _id: 0 } },
    ]).next(),
    responses.countDocuments(wishFilter),
    responses.find(wishFilter,
      { projection: { guestName: 1, message: 1, createdAt: 1 } }).sort({ createdAt: -1, _id: -1 }).limit(slug === "20260823-NDTD" ? 0 : 100).toArray(),
    slug === "20260823-NDTD" ? responses.find({ invitationId: invitation._id }, {
      projection: { guestName: 1, attending: 1, guestCount: 1, message: 1, createdAt: 1, updatedAt: 1 },
    }).sort({ updatedAt: -1, createdAt: -1, _id: -1 }).toArray() : Promise.resolve(null),
  ]);
  return { ...(totals ?? { responses: 0, attending: 0, declined: 0, guests: 0 }), wishCount,
    wishes: wishes.map(wish => ({ id: wish._id.toString(), guestName: wish.guestName, message: wish.message, createdAt: wish.createdAt })),
    ...(entries ? { entries: entries.map(entry => ({ id: entry._id.toString(), guestName: entry.guestName,
      attending: entry.attending, guestCount: entry.guestCount, message: entry.message ?? "",
      createdAt: entry.createdAt, updatedAt: entry.updatedAt ?? entry.createdAt })) } : {}),
  };
}
