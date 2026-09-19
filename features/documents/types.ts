/** Material enviado pelo professor — sempre associado a um aluno específico (sem "turma toda"). */
export type StudyDocument = {
  id: string;
  studentId: string | null;
  originalName: string;
  mimeType: string;
  extension: string;
  size: number;
  status: string;
  sentAt: string;
  updatedAt: string;
};
