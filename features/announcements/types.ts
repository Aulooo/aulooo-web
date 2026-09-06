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

/** O que a Server Action recebe para publicar/editar um aviso. */
export type AnnouncementInput = {
  title: string;
  body: string;
  audience: AnnouncementAudience;
  studentId: string | null;
  pinned: boolean;
};
