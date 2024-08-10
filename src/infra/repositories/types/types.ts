export type ShortUrl = {
  id?: string;
  shortId?: string;
  userId?: string;
  totalVisits?: number;
  lastVisit?: Date;
  redirectUrl?: string;
  deletedAt?: Date;
};

export type User = {
  email?: string;
  id?: string;
};
