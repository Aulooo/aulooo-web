import { scheduleApi } from "../api/schedule-api";
import type { LessonClass } from "../types";

export async function getClassAsProfessor(classId: string): Promise<LessonClass | null> {
  const res = await scheduleApi.getAsProfessor(classId);
  if (res.code !== 1) return null;
  return res.data;
}
