import { apiClient } from "@/core/http/api-client";
import type { EntryCode, StudentSummary } from "../types";

export const studentsApi = {
  list: () => apiClient.get<StudentSummary[]>("/professors/me/students"),

  deactivateLink: (studentId: string, reason?: string) =>
    apiClient.post<StudentSummary>(
      `/professors/me/students/${studentId}/deactivate-link`,
      reason ? { reason } : undefined,
    ),

  generateEntryCode: () => apiClient.post<EntryCode>("/professors/me/entry-codes"),
};
