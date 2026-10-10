import type { ObjectId } from "mongodb";

export type Invitation = {
  _id: ObjectId;
  code: string;
  slug: string;
  displayTitle?: string;
  displayCouple?: string;
  couple: { partnerOne: string; partnerTwo: string };
  event: { date: Date; venue: string; address?: string };
  createdAt: Date;
  updatedAt: Date;
};

export type Rsvp = {
  _id: ObjectId;
  invitationId: ObjectId;
  guestName: string;
  attending: boolean;
  guestCount: number;
  message?: string;
  publishMessage?: boolean;
  responseTokenHash?: string;
  updatedAt?: Date;
  createdAt: Date;
};
