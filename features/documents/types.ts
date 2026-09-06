export type DocumentKind = "pdf" | "video" | "image" | "sheet" | "doc" | "link";

/** "all" = turma toda; "student" = documento de um aluno específico. */
export type DocumentAudience = "all" | "student";

export type StudyDocument = {
  id: string;
  title: string;
  kind: DocumentKind;
  /** Tamanho em bytes (null quando kind = "link"). */
  sizeBytes?: number | null;
  url: string;
  authorId: string;
  audience: DocumentAudience;
  /** Preenchido quando audience = "student". */
  studentId?: string | null;
  uploadedAt: string;
};
