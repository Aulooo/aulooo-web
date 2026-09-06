"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/shared/lib/action-state";
import { paymentsDb } from "@/mock/db/payments";

export async function markPaymentPaid(id: string): Promise<ActionState> {
  const payment = await paymentsDb.markPaid(id);
  if (!payment) return { ok: false, message: "Pagamento não encontrado." };

  revalidatePath("/financeiro");
  revalidatePath("/pagamentos");
  revalidatePath("/home");
  return { ok: true, message: "Pagamento registrado." };
}
