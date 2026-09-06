import type { Role } from "@/features/auth";

/** Sem imports de servidor — pode ser usado no client (dev role switcher). */

export const MOCK_ROLE_COOKIE = "aulooo_mock_role";
export const DEFAULT_MOCK_ROLE: Role = "professor";
export const MOCK_ROLES: Role[] = ["admin", "professor", "aluno"];

export function resolveMockRole(raw: string | undefined | null): Role {
  return raw === "admin" || raw === "professor" || raw === "aluno" ? raw : DEFAULT_MOCK_ROLE;
}
