import { profileApi } from "../api/profile-api";
import type { StudentProfessorSummary } from "../types";

/**
 * Resumo do professor vinculado ao aluno logado — usado na seção "Sobre o
 * professor" do perfil. Retorna `null` em vez de lançar: é conteúdo
 * complementar, não deve derrubar a tela de perfil (ex.: vínculo inativo).
 */
export async function getMyProfessor(): Promise<StudentProfessorSummary | null> {
  const res = await profileApi.getStudentProfessor();
  return res.code === 1 && res.data ? res.data : null;
}
