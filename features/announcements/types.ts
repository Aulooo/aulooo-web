export type AnnouncementAudience = "all" | "student";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  authorId: string;
  audience: AnnouncementAudience;
  /** Preenchido quando audience = "student". */
  studentId?: string | null;
  pinned?: boolean;
  publishedAt: string;
};
