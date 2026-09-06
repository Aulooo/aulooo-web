import { redirect } from "next/navigation";
import { FinanceiroView } from "@/features/payments";
import { getMockSession } from "@/mock/session";
import { paymentsDb } from "@/mock/db/payments";
import { peopleDb } from "@/mock/db/people";

const sumCents = (total: number, p: { amountCents: number }) => total + p.amountCents;

export default async function FinanceiroPage() {
  const user = await getMockSession();
  if (user.role === "aluno") redirect("/pagamentos");

  const [payments, students] = await Promise.all([
    paymentsDb.currentMonth(),
    user.role === "professor" ? peopleDb.students(user.id) : peopleDb.students(),
  ]);

  const nameById = new Map(students.map((s) => [s.id, s.name] as const));
  const scoped =
    user.role === "professor" ? payments.filter((p) => nameById.has(p.studentId)) : payments;

  const rows = scoped
    .filter((p) => nameById.has(p.studentId))
    .map((payment) => ({ payment, studentName: nameById.get(payment.studentId) ?? "Aluno" }));

  return (
    <FinanceiroView
      rows={rows}
      receivedCents={scoped.filter((p) => p.status === "paid").reduce(sumCents, 0)}
      toReceiveCents={scoped.filter((p) => p.status !== "paid").reduce(sumCents, 0)}
      overdueCents={scoped.filter((p) => p.status === "overdue").reduce(sumCents, 0)}
    />
  );
}
