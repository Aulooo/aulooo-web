"use server";

import { profileApi } from "../api/profile-api";

/** Marca o tour guiado como concluído no perfil (fica no banco, não no navegador). */
export async function completeTour(role: "professor" | "aluno"): Promise<void> {
  if (role === "professor") {
    await profileApi.updateProfessorProfile({ tourCompleted: true });
  } else {
    await profileApi.updateStudentProfile({ tourCompleted: true });
  }
}
