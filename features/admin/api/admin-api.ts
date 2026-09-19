import { apiClient } from "@/core/http/api-client";
import type { AdminProfessorSummary, ProfessorEntryCode } from "../types";

export const adminApi = {
  generateProfessorEntryCode: () => apiClient.post<ProfessorEntryCode>("/admin/professor-entry-codes"),

  listProfessors: () => apiClient.get<AdminProfessorSummary[]>("/admin/professors"),

  generateStudentEntryCode: (professorId: string) =>
    apiClient.post<ProfessorEntryCode>(`/admin/professors/${professorId}/entry-codes`),
};
