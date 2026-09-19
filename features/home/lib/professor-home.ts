import { getMyAnnouncements } from "@/features/announcements";
import { defaultAgendaRange, getMyClasses } from "@/features/schedule";
import { getMyStudents } from "@/features/students";
import type { ProfessorHomeData } from "../types";
import { byPublishedDesc, byStartAsc, isToday } from "./date-range";

const isCanceled = (status: string) => /cancel/i.test(status);

export async function getProfessorHomeData(firstName: string): Promise<ProfessorHomeData> {
  const { from, to } = defaultAgendaRange();

  const [students, lessons, announcements] = await Promise.all([
    getMyStudents(),
    getMyClasses("professor", from, to),
    getMyAnnouncements("professor"),
  ]);

  const lessonsToday = lessons
    .filter((l) => !isCanceled(l.status) && isToday(l.startsAt))
    .sort(byStartAsc);

  return {
    firstName,
    activeStudents: students.filter((s) => !/inactive|desativad/i.test(s.linkStatus)).length,
    lessonsToday,
    announcements: [...announcements].sort(byPublishedDesc).slice(0, 2),
  };
}
