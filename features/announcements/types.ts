export type AnnouncementStatus = "Publicado" | "Arquivado";

/** Comunicado — sempre pra turma inteira (o vínculo ativo decide quem enxerga). */
export type Announcement = {
  id: string;
  title: string;
  content: string;
  status: AnnouncementStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type AnnouncementInput = {
  title: string;
  content: string;
};
