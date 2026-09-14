export type ProfileRole = "professor" | "aluno";

export type ProfessorProfile = {
  role: "professor";
  professorId: string;
  name: string;
  email: string;
  phone: string | null;
  cpf: string;
  dateOfBirth: string | null;
  professionalRegistration: string;
  professionalDescription: string | null;
  status: string;
  hasAvatar: boolean;
};

export type StudentProfile = {
  role: "aluno";
  studentId: string;
  name: string;
  email: string;
  phone: string | null;
  cpf: string;
  dateOfBirth: string | null;
  objective: string | null;
  /** Formato ainda não fechado pelo backend (DTO conceitual). */
  professorSummary: unknown;
  linkStatus: string;
  hasAvatar: boolean;
};

/** Identidade visual do professor — só afeta a própria tela de perfil dele. */
export type ProfessorBranding = {
  brandColor: string | null;
  hasBanner: boolean;
};

export type ProfessorBrandingInput = {
  brandColor: string;
};

/** Perfil do usuário autenticado — o papel real vem de `GET /auth/me`. */
export type Profile = ProfessorProfile | StudentProfile;

export type UpdateProfessorProfileInput = Partial<{
  name: string;
  phone: string;
  dateOfBirth: string;
  professionalRegistration: string;
  professionalDescription: string;
}>;

export type UpdateStudentProfileInput = Partial<{
  name: string;
  phone: string;
  dateOfBirth: string;
  objective: string;
}>;
