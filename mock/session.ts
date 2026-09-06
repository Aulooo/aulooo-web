import { cookies } from "next/headers";
import type { Role, SessionUser } from "@/features/auth";
import { MOCK_ROLE_COOKIE, resolveMockRole } from "./role-cookie";

/**
 * Sessão mockada. Enquanto o backend de auth não existe, a "sessão" é só um
 * usuário fixo por papel. O papel ativo vem do cookie `aulooo_mock_role`, que
 * o dev role switcher (`features/dev`) define.
 */

export { MOCK_ROLE_COOKIE, DEFAULT_MOCK_ROLE, MOCK_ROLES, resolveMockRole } from "./role-cookie";

export const MOCK_USERS: Record<Role, SessionUser> = {
  admin: {
    id: "usr_admin",
    name: "Marina Alves",
    email: "marina@studioalves.com.br",
    role: "admin",
    avatarUrl: null,
    tenantName: "Studio Alves",
  },
  professor: {
    id: "usr_prof",
    name: "Rafael Nunes",
    email: "rafael@studioalves.com.br",
    role: "professor",
    avatarUrl: null,
    tenantName: "Studio Alves",
  },
  aluno: {
    id: "usr_aluno",
    name: "Beatriz Lima",
    email: "bia.lima@gmail.com",
    role: "aluno",
    avatarUrl: null,
    tenantName: "Studio Alves",
  },
};

/** Usuário da sessão atual (server-side). */
export async function getMockSession(): Promise<SessionUser> {
  const store = await cookies();
  return MOCK_USERS[resolveMockRole(store.get(MOCK_ROLE_COOKIE)?.value)];
}
