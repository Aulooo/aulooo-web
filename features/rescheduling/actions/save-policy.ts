"use server";

import { revalidatePath } from "next/cache";
import { envelopeFieldErrors } from "@/core/http/api-client";
import type { ActionState } from "@/shared/lib/action-state";
import { zodErrorsToRecord } from "@/shared/lib/action-state";
import { reschedulingApi } from "../api/rescheduling-api";
import { policyInputSchema } from "../lib/rescheduling-schema";

export async function savePolicy(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = policyInputSchema.safeParse({
    minimumNoticeHours: String(formData.get("minimumNoticeHours") ?? ""),
    monthlyLimit: String(formData.get("monthlyLimit") ?? ""),
    // Checkbox nativo: presente no FormData só quando marcado.
    allowStudentSelfScheduling: formData.get("allowStudentSelfScheduling") === "on",
  });

  if (!parsed.success) {
    return { ok: false, message: "Confira os campos.", errors: zodErrorsToRecord(parsed.error.issues) };
  }

  const result = await reschedulingApi.updatePolicy(parsed.data);
  if (result.code !== 1) {
    return { ok: false, message: result.message, errors: envelopeFieldErrors(result) };
  }

  revalidatePath("/reagendamentos");
  return { ok: true, message: "Política atualizada." };
}
