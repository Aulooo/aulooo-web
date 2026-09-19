export type ProfileRole = "professor" | "aluno" | "admin";

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
  tourCompleted: boolean;
  /** Identificador de URL (ex.: "joao-silva" em joao-silva.aulooo.com). `null` até o professor definir um. */
  slug: string | null;
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
  tourCompleted: boolean;
};

/** `GET /students/me/professor` — resumo público do professor vinculado ao aluno. */
export type StudentProfessorSummary = {
  professorId: string;
  name: string;
  professionalRegistration: string;
  description: string | null;
  status: string;
  slug: string | null;
  brandColor: string | null;
  hasBanner: boolean;
};

/** Admin não tem perfil de Professor/Aluno — só nome e e-mail, vindos de `/auth/me`. */
export type AdminProfile = {
  role: "admin";
  name: string;
  email: string;
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
export type Profile = ProfessorProfile | StudentProfile | AdminProfile;

export type UpdateProfessorProfileInput = Partial<{
  name: string;
  phone: string;
  dateOfBirth: string;
  professionalRegistration: string;
  professionalDescription: string;
  tourCompleted: boolean;
  slug: string;
}>;

export type UpdateStudentProfileInput = Partial<{
  name: string;
  phone: string;
  dateOfBirth: string;
  objective: string;
  tourCompleted: boolean;
}>;
