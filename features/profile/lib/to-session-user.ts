import type { SessionUser } from "@/features/auth";
import type { Profile } from "../types";

/** Adapta o `Profile` real pro `SessionUser` que a casca (shell/home) consome. */
export function toSessionUser(profile: Profile): SessionUser {
  const id = profile.role === "professor" ? profile.professorId : profile.role === "aluno" ? profile.studentId : profile.email;

  return {
    id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    avatarUrl: profile.role !== "admin" && profile.hasAvatar ? "/api/avatar" : null,
    tenantName: "Aulooo",
  };
}
