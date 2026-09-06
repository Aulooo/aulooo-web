import type { Payment } from "../types";

export type FinanceiroRow = {
  payment: Payment;
  studentName: string;
};

export type FinanceiroViewProps = {
  rows: FinanceiroRow[];
  receivedCents: number;
  toReceiveCents: number;
  overdueCents: number;
};
