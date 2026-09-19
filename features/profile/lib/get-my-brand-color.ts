import { profileApi } from "../api/profile-api";
import type { ProfileRole } from "../types";

/**
 * Cor de marca aplicada no tema (professor: a própria; aluno: a do professor
 * vinculado). Nunca lança — roda no layout raiz autenticado, e cor de marca é
 * decorativa: uma falha aqui não pode derrubar a aplicação inteira.
 */
export async function getMyBrandColor(role: ProfileRole): Promise<string | null> {
  try {
    if (role === "professor") {
      const res = await profileApi.getBranding();
      return res.code === 1 ? (res.data?.brandColor ?? null) : null;
    }
    if (role === "aluno") {
      const res = await profileApi.getStudentProfessor();
      return res.code === 1 ? (res.data?.brandColor ?? null) : null;
    }
    return null;
  } catch {
    return null;
  }
}
