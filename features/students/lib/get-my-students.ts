import { studentsApi } from "../api/students-api";
import type { StudentSummary } from "../types";

export async function getMyStudents(): Promise<StudentSummary[]> {
  const res = await studentsApi.list();
  if (res.code !== 1 || !res.data) {
    throw new Error(res.message || "Não foi possível carregar seus alunos.");
  }
  return res.data;
}
