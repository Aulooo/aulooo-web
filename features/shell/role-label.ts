import type { Role } from "@/features/auth";

/** Rótulo legível de cada papel, para exibição na UI. */
export const ROLE_LABEL: Record<Role, string> = {
  professor: "Professor",
  aluno: "Aluno",
};
