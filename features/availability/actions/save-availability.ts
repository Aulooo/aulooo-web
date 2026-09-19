"use server";

import { revalidatePath } from "next/cache";
import { envelopeFieldErrors } from "@/core/http/api-client";
import type { ActionState } from "@/shared/lib/action-state";
import { zodErrorsToRecord } from "@/shared/lib/action-state";
import { availabilityApi } from "../api/availability-api";
import { availabilityInputSchema } from "../lib/availability-schema";

export async function saveAvailability(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const parsed = availabilityInputSchema.safeParse({
    dayOfWeek: String(formData.get("dayOfWeek") ?? ""),
    startTime: String(formData.get("startTime") ?? ""),
    endTime: String(formData.get("endTime") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, message: "Confira os campos.", errors: zodErrorsToRecord(parsed.error.issues) };
  }

  const result = id
    ? await availabilityApi.update(id, parsed.data)
    : await availabilityApi.create(parsed.data);

  if (result.code !== 1) {
    return { ok: false, message: result.message, errors: envelopeFieldErrors(result) };
  }

  revalidatePath("/disponibilidade");
  return { ok: true, id: result.data?.id, message: id ? "Disponibilidade atualizada." : "Disponibilidade criada." };
}
