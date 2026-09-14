/** Perfil reduzido de aluno, como o professor enxerga (sem CPF/e-mail/data de nascimento). */
export type StudentSummary = {
  studentId: string;
  name: string;
  phone: string | null;
  objective: string | null;
  linkStatus: string;
};

export type EntryCode = {
  codeId: string;
  code: string;
  expiresAt: string;
  status: string;
};
