import { announcementsDb } from "@/mock/db/announcements";
import { lessonsDb } from "@/mock/db/lessons";
import { paymentsDb } from "@/mock/db/payments";
import { peopleDb } from "@/mock/db/people";
import type { ProfessorHomeData } from "../types";
import { byPublishedDesc, byStartAsc, daysOverdue, isToday } from "./date-range";

const sumCents = (total: number, p: { amountCents: number }) => total + p.amountCents;

export async function getProfessorHomeData(
  teacherId: string,
  firstName: string,
): Promise<ProfessorHomeData> {
  const [students, currentPayments, teacherLessons, announcements] = await Promise.all([
    peopleDb.students(teacherId),
    paymentsDb.currentMonth(),
    lessonsDb.forTeacher(teacherId),
    announcementsDb.byAuthor(teacherId),
  ]);

  const studentIds = new Set(students.map((s) => s.id));
  const activeIds = new Set(students.filter((s) => s.status !== "inactive").map((s) => s.id));
  const nameById = new Map(students.map((s) => [s.id, s.name] as const));

  const mine = currentPayments.filter((p) => studentIds.has(p.studentId));
  const receivedCents = mine.filter((p) => p.status === "paid").reduce(sumCents, 0);
  const toReceiveCents = mine.filter((p) => p.status !== "paid").reduce(sumCents, 0);

  const lessonsToday = teacherLessons
    .filter((l) => l.status !== "canceled" && isToday(l.startsAt))
    .sort(byStartAsc);

  const pendingPayments = mine
    .filter((p) => p.status !== "paid" && activeIds.has(p.studentId))
    .map((payment) => ({
      payment,
      studentName: nameById.get(payment.studentId) ?? "Aluno",
      daysOverdue: payment.status === "overdue" ? daysOverdue(payment.dueDate) : 0,
    }))
    .sort((a, b) => b.daysOverdue - a.daysOverdue)
    .slice(0, 4);

  return {
    firstName,
    activeStudents: students.filter((s) => s.status === "active").length,
    receivedCents,
    toReceiveCents,
    lessonsToday,
    pendingPayments,
    announcements: [...announcements].sort(byPublishedDesc).slice(0, 2),
  };
}
