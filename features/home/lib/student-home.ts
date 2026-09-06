import { announcementsDb } from "@/mock/db/announcements";
import { documentsDb } from "@/mock/db/documents";
import { lessonsDb } from "@/mock/db/lessons";
import { paymentsDb } from "@/mock/db/payments";
import { monthKey } from "@/mock/_helpers";
import type { StudentHomeData } from "../types";
import { byPublishedDesc, byStartAsc } from "./date-range";

/**
 * View-model da home do aluno. Quando o backend existir, cada bloco vira uma
 * chamada em `features/<x>/api/` — a forma de `StudentHomeData` continua igual.
 */
export async function getStudentHomeData(
  studentId: string,
  firstName: string,
): Promise<StudentHomeData> {
  const horizon = Date.now() - 60 * 60 * 1000; // aula que começou há < 1h ainda conta

  const [lessons, payments, announcements, documents] = await Promise.all([
    lessonsDb.forStudent(studentId),
    paymentsDb.forStudent(studentId),
    announcementsDb.forStudent(studentId),
    documentsDb.forStudent(studentId),
  ]);

  const nextLesson =
    lessons
      .filter((l) => l.status === "scheduled" && new Date(l.startsAt).getTime() >= horizon)
      .sort(byStartAsc)[0] ?? null;

  const currentPayment =
    payments.find((p) => p.referenceMonth === monthKey(0)) ?? null;

  return {
    firstName,
    nextLesson,
    currentPayment,
    announcements: [...announcements]
      .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || byPublishedDesc(a, b))
      .slice(0, 3),
    documents: [...documents]
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(0, 4),
  };
}
