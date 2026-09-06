import type { Payment, PaymentStatus } from "@/features/payments";
import { MOCK_STUDENTS } from "./students";
import { dueDate, isoIn, monthKey } from "./_helpers";

const billable = MOCK_STUDENTS.filter((s) => s.monthlyFeeCents > 0);

/**
 * Mês passado: tudo pago. Mês atual: mistura determinística de
 * pago / pendente / atrasado para as telas terem os 3 estados.
 */
export const MOCK_PAYMENTS: Payment[] = billable.flatMap((student, i) => {
  const previous: Payment = {
    id: `pay_${student.id}_prev`,
    studentId: student.id,
    referenceMonth: monthKey(-1),
    amountCents: student.monthlyFeeCents,
    status: "paid",
    dueDate: dueDate(student.dueDay, -1),
    paidAt: dueDate(student.dueDay, -1),
    method: (["pix", "card", "transfer", "cash"] as const)[i % 4],
  };

  const status: PaymentStatus = i % 4 === 0 ? "pending" : i % 4 === 1 ? "overdue" : "paid";
  const current: Payment = {
    id: `pay_${student.id}_curr`,
    studentId: student.id,
    referenceMonth: monthKey(0),
    amountCents: student.monthlyFeeCents,
    status,
    dueDate:
      status === "overdue" ? isoIn(-4, 12) : status === "pending" ? isoIn(3, 12) : dueDate(student.dueDay),
    paidAt: status === "paid" ? isoIn(-5) : null,
    method: status === "paid" ? "pix" : null,
  };

  return [previous, current];
});

export const MOCK_PAYMENTS_CURRENT_MONTH = MOCK_PAYMENTS.filter(
  (p) => p.referenceMonth === monthKey(0),
);
