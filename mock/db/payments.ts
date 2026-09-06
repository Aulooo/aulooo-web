import type { Payment } from "@/features/payments";
import { jsonStore } from "../json-store";
import { seedPayments } from "./seed-data";
import { monthKey } from "../_helpers";

const store = jsonStore<Payment>("payments", seedPayments);

export const paymentsDb = {
  list: store.list,
  get: store.get,

  async currentMonth(): Promise<Payment[]> {
    return store.where((p) => p.referenceMonth === monthKey(0));
  },

  async forStudent(studentId: string): Promise<Payment[]> {
    return store.where((p) => p.studentId === studentId);
  },

  async markPaid(id: string): Promise<Payment | null> {
    return store.patch(id, {
      status: "paid",
      paidAt: new Date().toISOString(),
      method: "pix",
    });
  },
};
