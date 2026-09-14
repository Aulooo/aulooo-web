import { getMyAnnouncements } from "@/features/announcements";
import { getMyMaterialsAsStudent } from "@/features/documents";
import { defaultAgendaRange, getMyClasses } from "@/features/schedule";
import type { StudentHomeData } from "../types";
import { byPublishedDesc, byStartAsc } from "./date-range";

const isCanceled = (status: string) => /cancel/i.test(status);

export async function getStudentHomeData(firstName: string): Promise<StudentHomeData> {
  const horizon = Date.now() - 60 * 60 * 1000; // aula que começou há < 1h ainda conta
  const { from, to } = defaultAgendaRange();

  const [lessons, announcements, documents] = await Promise.all([
    getMyClasses("aluno", from, to),
    getMyAnnouncements("aluno"),
    getMyMaterialsAsStudent(),
  ]);

  const nextLesson =
    lessons
      .filter((l) => !isCanceled(l.status) && new Date(l.startsAt).getTime() >= horizon)
      .sort(byStartAsc)[0] ?? null;

  return {
    firstName,
    nextLesson,
    announcements: [...announcements].sort(byPublishedDesc).slice(0, 3),
    documents: [...documents]
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
      .slice(0, 4),
  };
}
