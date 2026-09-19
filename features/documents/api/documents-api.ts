import { apiClient } from "@/core/http/api-client";
import type { StudyDocument } from "../types";

type RawMaterial = {
  materialId: string;
  studentId?: string | null;
  originalName: string;
  mimeType: string;
  extension: string;
  size: number;
  status: string;
  sentAt: string;
  updatedAt: string;
};

function toDocument({ materialId, ...rest }: RawMaterial): StudyDocument {
  return { id: materialId, studentId: rest.studentId ?? null, ...rest };
}

export const documentsApi = {
  async listForStudentAsProfessor(studentId: string) {
    const res = await apiClient.get<RawMaterial[]>(`/professors/me/students/${studentId}/materials`);
    return { ...res, data: res.data?.map(toDocument) ?? null };
  },

  async listAsStudent() {
    const res = await apiClient.get<RawMaterial[]>("/students/me/materials");
    return { ...res, data: res.data?.map(toDocument) ?? null };
  },

  async upload(studentId: string, form: FormData) {
    const res = await apiClient.postForm<RawMaterial>(`/professors/me/students/${studentId}/materials`, form);
    return { ...res, data: res.data ? toDocument(res.data) : null };
  },

  async deactivate(materialId: string) {
    const res = await apiClient.post<RawMaterial>(`/professors/me/materials/${materialId}/deactivate`);
    return { ...res, data: res.data ? toDocument(res.data) : null };
  },
};
