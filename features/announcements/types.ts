// Valor real vindo da API (RecordStatus.ToString() em C#) — corrigido aqui,
// estava com os literais em português sem corresponder ao runtime.
export type AnnouncementStatus = "Active" | "Archived" | "Deactivated";

/**
 * Comunicado. Por padrão vai pra todo o alcance dinâmico do professor
 * (`audience: "All"`); quando `audience: "Specific"`, só os alunos em
 * `recipientStudentIds` veem — fixado na criação, não muda na edição.
 */
export type Announcement = {
  id: string;
  title: string;
  content: string;
  status: AnnouncementStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  audience: "All" | "Specific";
  recipientStudentIds: string[];
};

export type AnnouncementInput = {
  title: string;
  content: string;
  /** Só lido na criação — o backend ignora em updates. */
  recipientStudentIds?: string[];
};
