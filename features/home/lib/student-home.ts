import { MOCK_ANNOUNCEMENTS } from "@/mock/announcements";
import { MOCK_DOCUMENTS } from "@/mock/documents";
import { MOCK_PAYMENTS } from "@/mock/payments";
import { MOCK_LESSONS } from "@/mock/schedule";
import { monthKey } from "@/mock/_helpers";
import type { StudentHomeData } from "../types";
import { byPublishedDesc, byStartAsc } from "./date-range";

/**
 * View-model da home do aluno. Quando o backend existir, cada bloco vira uma
 * chamada em `features/<x>/api/` — a forma de `StudentHomeData` continua igual.
 */
export function getStudentHomeData(studentId: string, firstName: string): StudentHomeData {
  const horizon = Date.now() - 60 * 60 * 1000; // aula que começou há < 1h ainda conta

  const nextLesson =
    MOCK_LESSONS.filter(
      (l) =>
        (l.studentId === studentId || l.studentId === null) &&
        new Date(l.startsAt).getTime() >= horizon,
    ).sort(byStartAsc)[0] ?? null;

  const currentPayment =
    MOCK_PAYMENTS.find(
      (p) => p.studentId === studentId && p.referenceMonth === monthKey(0),
    ) ?? null;

  const announcements = MOCK_ANNOUNCEMENTS.filter(
    (a) => a.audience === "all" || a.studentId === studentId,
  )
    .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || byPublishedDesc(a, b))
    .slice(0, 3);

  const documents = [...MOCK_DOCUMENTS]
    .filter((d) => d.audience === "all" || d.studentId === studentId)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 4);

  return { firstName, nextLesson, currentPayment, announcements, documents };
}
