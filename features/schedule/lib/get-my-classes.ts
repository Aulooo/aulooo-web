import { scheduleApi } from "../api/schedule-api";
import type { LessonClass } from "../types";

export async function getMyClasses(
  role: "professor" | "aluno",
  from: string,
  to: string,
): Promise<LessonClass[]> {
  const res = role === "professor" ? await scheduleApi.listAsProfessor(from, to) : await scheduleApi.listAsStudent(from, to);
  if (res.code !== 1 || !res.data) {
    throw new Error(res.message || "Não foi possível carregar a agenda.");
  }
  return res.data;
}
