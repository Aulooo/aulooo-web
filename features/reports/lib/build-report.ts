import { paymentsDb } from "@/mock/db/payments";
import { peopleDb } from "@/mock/db/people";
import { monthKey } from "@/mock/_helpers";

const sumCents = (total: number, p: { amountCents: number }) => total + p.amountCents;

export type AdminReport = {
  totalPeople: number;
  activeStudents: number;
  activeTeachers: number;
  revenueCents: number;
  billedCents: number;
  overdueCents: number;
  studentsByTeacher: { teacherName: string; count: number }[];
  paymentBreakdown: { paid: number; pending: number; overdue: number };
};

export async function getAdminReport(): Promise<AdminReport> {
  const [people, current] = await Promise.all([peopleDb.list(), paymentsDb.currentMonth()]);

  const students = people.filter((p) => p.roles.includes("aluno"));
  const teachers = people.filter((p) => p.roles.includes("professor"));

  const studentsByTeacher = teachers
    .map((t) => ({
      teacherName: t.name,
      count: students.filter((s) => s.studentProfile?.teacherId === t.id && s.status !== "inactive").length,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalPeople: people.length,
    activeStudents: students.filter((s) => s.status !== "inactive").length,
    activeTeachers: teachers.filter((t) => t.status === "active").length,
    revenueCents: current.filter((p) => p.status === "paid").reduce(sumCents, 0),
    billedCents: current.reduce(sumCents, 0),
    overdueCents: current.filter((p) => p.status === "overdue").reduce(sumCents, 0),
    studentsByTeacher,
    paymentBreakdown: {
      paid: current.filter((p) => p.status === "paid").length,
      pending: current.filter((p) => p.status === "pending").length,
      overdue: current.filter((p) => p.status === "overdue").length,
    },
  };
}

export const CURRENT_MONTH_LABEL = new Date(`${monthKey(0)}-01T12:00`).toLocaleDateString("pt-BR", {
  month: "long",
  year: "numeric",
});
