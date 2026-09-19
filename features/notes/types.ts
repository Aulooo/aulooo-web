/** Observação privada do professor sobre um aluno — nunca visível ao aluno. */
export type PrivateNote = {
  id: string;
  studentId: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type NoteInput = {
  content: string;
};
