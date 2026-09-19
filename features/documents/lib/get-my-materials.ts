import { documentsApi } from "../api/documents-api";
import type { StudyDocument } from "../types";

export async function getMaterialsForStudent(studentId: string): Promise<StudyDocument[]> {
  const res = await documentsApi.listForStudentAsProfessor(studentId);
  if (res.code !== 1 || !res.data) {
    throw new Error(res.message || "Não foi possível carregar os materiais.");
  }
  return res.data;
}

export async function getMyMaterialsAsStudent(): Promise<StudyDocument[]> {
  const res = await documentsApi.listAsStudent();
  if (res.code !== 1 || !res.data) {
    throw new Error(res.message || "Não foi possível carregar os materiais.");
  }
  return res.data;
}
