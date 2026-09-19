import { adminApi } from "../api/admin-api";
import type { AdminProfessorSummary } from "../types";

export async function getProfessors(): Promise<AdminProfessorSummary[]> {
  const result = await adminApi.listProfessors();
  return result.code === 1 && result.data ? result.data : [];
}
