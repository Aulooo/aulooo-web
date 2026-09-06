import { MOCK_ANNOUNCEMENTS } from "@/mock/announcements";
import { MOCK_PAYMENTS } from "@/mock/payments";
import { MOCK_STUDENTS, MOCK_STUDENTS_BY_ID } from "@/mock/students";
import { MOCK_TEACHERS } from "@/mock/teachers";
import { monthKey } from "@/mock/_helpers";
import type { ActivityItem, AdminHomeData } from "../types";

const sumCents = (total: number, p: { amountCents: number }) => total + p.amountCents;
const studentName = (id: string) => MOCK_STUDENTS_BY_ID[id]?.name ?? "Aluno";

export function getAdminHomeData(firstName: string, tenantName: string): AdminHomeData {
  const activeStudents = MOCK_STUDENTS.filter((s) => s.status !== "inactive").length;
  const activeTeachers = MOCK_TEACHERS.filter((t) => t.status === "active").length;

  const currentPayments = MOCK_PAYMENTS.filter((p) => p.referenceMonth === monthKey(0));
  const revenueCents = currentPayments.filter((p) => p.status === "paid").reduce(sumCents, 0);
  const overdue = currentPayments.filter((p) => p.status === "overdue");
  const overdueCents = overdue.reduce(sumCents, 0);

  const activity: ActivityItem[] = [
    ...MOCK_PAYMENTS.filter((p) => p.status === "paid" && p.paidAt).map((p) => ({
      id: `act_pay_${p.id}`,
      kind: "payment" as const,
      text: `${studentName(p.studentId)} pagou a mensalidade`,
      at: p.paidAt as string,
    })),
    ...MOCK_STUDENTS.map((s) => ({
      id: `act_std_${s.id}`,
      kind: "student" as const,
      text: `${s.name} entrou como aluno`,
      at: s.joinedAt,
    })),
    ...MOCK_ANNOUNCEMENTS.map((a) => ({
      id: `act_ann_${a.id}`,
      kind: "announcement" as const,
      text: `Aviso publicado: “${a.title}”`,
      at: a.publishedAt,
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 6);

  return {
    firstName,
    tenantName,
    activeStudents,
    activeTeachers,
    revenueCents,
    overdueCents,
    overdueCount: overdue.length,
    activity,
  };
}
