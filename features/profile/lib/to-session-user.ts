import type { SessionUser } from "@/features/auth";
import type { Profile } from "../types";

/** Adapta o `Profile` real pro `SessionUser` que a casca (shell/home) consome. */
export function toSessionUser(profile: Profile): SessionUser {
  return {
    id: profile.role === "professor" ? profile.professorId : profile.studentId,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    avatarUrl: profile.hasAvatar ? "/api/avatar" : null,
    tenantName: "Aulooo",
  };
}
