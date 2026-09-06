import { announcementsDb } from "@/mock/db/announcements";
import { paymentsDb } from "@/mock/db/payments";
import { peopleDb } from "@/mock/db/people";
import { monthKey } from "@/mock/_helpers";
import type { ActivityItem, AdminHomeData } from "../types";

const sumCents = (total: number, p: { amountCents: number }) => total + p.amountCents;

export async function getAdminHomeData(
  firstName: string,
  tenantName: string,
): Promise<AdminHomeData> {
  const [people, payments, announcements] = await Promise.all([
    peopleDb.list(),
    paymentsDb.list(),
    announcementsDb.list(),
  ]);

  const nameById = new Map(people.map((p) => [p.id, p.name] as const));
  const students = people.filter((p) => p.roles.includes("aluno"));
  const teachers = people.filter((p) => p.roles.includes("professor"));

  const currentPayments = payments.filter((p) => p.referenceMonth === monthKey(0));
  const revenueCents = currentPayments.filter((p) => p.status === "paid").reduce(sumCents, 0);
  const overdue = currentPayments.filter((p) => p.status === "overdue");

  const activity: ActivityItem[] = [
    ...payments
      .filter((p) => p.status === "paid" && p.paidAt)
      .map((p) => ({
        id: `act_pay_${p.id}`,
        kind: "payment" as const,
        text: `${nameById.get(p.studentId) ?? "Aluno"} pagou a mensalidade`,
        at: p.paidAt as string,
      })),
    ...students.map((s) => ({
      id: `act_std_${s.id}`,
      kind: "student" as const,
      text: `${s.name} entrou como aluno`,
      at: s.createdAt,
    })),
    ...announcements.map((a) => ({
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
    activeStudents: students.filter((s) => s.status !== "inactive").length,
    activeTeachers: teachers.filter((t) => t.status === "active").length,
    revenueCents,
    overdueCents: overdue.reduce(sumCents, 0),
    overdueCount: overdue.length,
    activity,
  };
}
