import { apiClient } from "@/core/http/api-client";
import type { CreateClassInput, CreateSeriesInput, LessonClass } from "../types";

type RawClass = {
  classId: string;
  professorId?: string;
  studentId?: string | null;
  seriesId?: string | null;
  startsAt: string;
  endsAt: string;
  timeZone?: string;
  status: string;
  originalSchedule?: unknown;
  individualException?: boolean;
  cancellationReason?: string | null;
};

function toLesson(raw: RawClass): LessonClass {
  return {
    id: raw.classId,
    studentId: raw.studentId ?? null,
    seriesId: raw.seriesId ?? null,
    startsAt: raw.startsAt,
    endsAt: raw.endsAt,
    status: raw.status,
    cancellationReason: raw.cancellationReason ?? null,
  };
}

export const scheduleApi = {
  async listAsProfessor(from: string, to: string) {
    const res = await apiClient.get<RawClass[]>(`/professors/me/classes?from=${from}&to=${to}`);
    return { ...res, data: res.data?.map(toLesson) ?? null };
  },

  async listAsStudent(from: string, to: string) {
    const res = await apiClient.get<RawClass[]>(`/students/me/classes?from=${from}&to=${to}`);
    return { ...res, data: res.data?.map(toLesson) ?? null };
  },

  async getAsProfessor(classId: string) {
    const res = await apiClient.get<RawClass>(`/professors/me/classes/${classId}`);
    return { ...res, data: res.data ? toLesson(res.data) : null };
  },

  async createClass(input: CreateClassInput) {
    const res = await apiClient.post<RawClass>("/professors/me/classes", input);
    return { ...res, data: res.data ? toLesson(res.data) : null };
  },

  createSeries: (input: CreateSeriesInput) => apiClient.post("/professors/me/series", input),

  async cancelClass(classId: string) {
    const res = await apiClient.post<RawClass>(`/professors/me/classes/${classId}/cancel`);
    return { ...res, data: res.data ? toLesson(res.data) : null };
  },
};
