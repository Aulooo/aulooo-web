export type ProfessorEntryCode = {
  codeId: string;
  code: string;
  expiresAt: string;
  status: string;
};

/** Professor como o admin enxerga — usado só pra gerar convite de aluno em nome dele. */
export type AdminProfessorSummary = {
  professorId: string;
  name: string;
  professionalRegistration: string;
  status: string;
};
