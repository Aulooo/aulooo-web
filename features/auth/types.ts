export type SignInCredentials = {
  email: string;
  password: string;
};

/** Papéis de acesso. Virá de uma tabela de roles (usuário ↔ role) no backend. */
export type Role = "admin" | "professor" | "aluno";

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

export type AuthenticatedUser = {
  code: number;
  message: string;
  data?: {
    token: string;
    user: {
      name: string;
      email: string;
    }
  }
};
