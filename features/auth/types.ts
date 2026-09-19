export type SignInCredentials = {
  email: string;
  password: string;
};

/** Papéis de acesso. */
export type Role = "professor" | "aluno" | "admin";

/** Usuário da sessão atual, já com o papel resolvido para o tenant ativo. */
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string | null;
  /** Nome da conta/tenant que o usuário está acessando. */
  tenantName: string;
};

/** Role como a API real devolve (case do backend — distinto do `Role` mockado da UI). */
export type ApiRole = "Professor" | "Aluno" | "Admin";

/** `data` de AuthResponse (`POST /auth/sign-in`, `/auth/sign-up/*`). */
export type AuthenticatedUser = {
  accessToken: string;
  tokenType: string;
  expiresAt?: string;
  user: {
    userId: string;
    email: string;
    role: ApiRole;
  };
  profile: Record<string, unknown>;
};

export type ProfessorSignUpInput = {
  entryCode: string;
  name: string;
  cpf: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  professionalRegistration: string;
  professionalDescription?: string;
};

export type StudentSignUpInput = {
  entryCode: string;
  name: string;
  cpf: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  objective?: string;
};
