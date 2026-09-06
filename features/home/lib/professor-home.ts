import { MOCK_ANNOUNCEMENTS } from "@/mock/announcements";
import { MOCK_PAYMENTS } from "@/mock/payments";
import { MOCK_LESSONS } from "@/mock/schedule";
import { MOCK_STUDENTS, MOCK_STUDENTS_BY_ID } from "@/mock/students";
import { monthKey } from "@/mock/_helpers";
import type { ProfessorHomeData } from "../types";
import { byPublishedDesc, byStartAsc, daysOverdue, isToday } from "./date-range";

const sumCents = (total: number, p: { amountCents: number }) => total + p.amountCents;

export function getProfessorHomeData(teacherId: string, firstName: string): ProfessorHomeData {
  const students = MOCK_STUDENTS.filter((s) => s.teacherId === teacherId);
  const activeStudents = students.filter((s) => s.status === "active").length;

  const currentPayments = MOCK_PAYMENTS.filter((p) => p.referenceMonth === monthKey(0));
  const receivedCents = currentPayments.filter((p) => p.status === "paid").reduce(sumCents, 0);
  const toReceiveCents = currentPayments.filter((p) => p.status !== "paid").reduce(sumCents, 0);

  const lessonsToday = MOCK_LESSONS.filter((l) => isToday(l.startsAt)).sort(byStartAsc);

  const pendingPayments = currentPayments
    .filter((p) => p.status !== "paid")
    .map((payment) => ({
      payment,
      student: MOCK_STUDENTS_BY_ID[payment.studentId],
      daysOverdue: payment.status === "overdue" ? daysOverdue(payment.dueDate) : 0,
    }))
    .filter((row) => row.student && row.student.status !== "inactive")
    .sort((a, b) => b.daysOverdue - a.daysOverdue)
    .slice(0, 4);

  const announcements = [...MOCK_ANNOUNCEMENTS].sort(byPublishedDesc).slice(0, 2);

  return {
    firstName,
    activeStudents,
    receivedCents,
    toReceiveCents,
    lessonsToday,
    pendingPayments,
    announcements,
  };
}
