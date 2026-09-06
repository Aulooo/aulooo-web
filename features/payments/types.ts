export type PaymentStatus = "paid" | "pending" | "overdue";

export type PaymentMethod = "pix" | "card" | "cash" | "transfer";

export type Payment = {
  id: string;
  studentId: string;
  /** Competência no formato YYYY-MM. */
  referenceMonth: string;
  amountCents: number;
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string | null;
  method?: PaymentMethod | null;
};
