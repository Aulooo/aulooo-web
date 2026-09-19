import { profileApi } from "../api/profile-api";
import type { Profile } from "../types";

/**
 * Perfil do usuário autenticado. O papel vem de `GET /auth/me` (fonte da verdade do
 * token) — a partir dele busca `/professors/me` ou `/students/me`.
 */
export async function getCurrentProfile(): Promise<Profile> {
  const me = await profileApi.getCurrentUser();
  if (me.code !== 1 || !me.data) {
    throw new Error(me.message || "Não foi possível identificar o usuário autenticado.");
  }

  if (me.data.role === "Professor") {
    const res = await profileApi.getProfessorProfile();
    if (res.code !== 1 || !res.data) {
      throw new Error(res.message || "Não foi possível carregar o perfil do professor.");
    }
    return { role: "professor", ...res.data };
  }

  if (me.data.role === "Admin") {
    const summary = me.data.profileSummary as { name?: string } | null;
    return { role: "admin", name: summary?.name ?? "Administrador", email: me.data.email };
  }

  const res = await profileApi.getStudentProfile();
  if (res.code !== 1 || !res.data) {
    throw new Error(res.message || "Não foi possível carregar o perfil do aluno.");
  }
  return { role: "aluno", ...res.data };
}
