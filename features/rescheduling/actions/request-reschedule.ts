"use server";

import { revalidatePath } from "next/cache";
import { envelopeFieldErrors } from "@/core/http/api-client";
import type { ActionState } from "@/shared/lib/action-state";
import { zodErrorsToRecord } from "@/shared/lib/action-state";
import { reschedulingApi } from "../api/rescheduling-api";
import { reschedulingRequestSchema } from "../lib/rescheduling-schema";

export async function requestReschedule(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const classId = String(formData.get("classId") ?? "");
  if (!classId) return { ok: false, message: "Aula inválida." };

  const parsed = reschedulingRequestSchema.safeParse({
    newDate: String(formData.get("newDate") ?? ""),
    newStartTime: String(formData.get("newStartTime") ?? ""),
    newEndTime: String(formData.get("newEndTime") ?? ""),
    reason: String(formData.get("reason") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, message: "Confira os campos.", errors: zodErrorsToRecord(parsed.error.issues) };
  }

  const { reason, ...rest } = parsed.data;
  const result = await reschedulingApi.createAsStudent(classId, { ...rest, reason: reason || undefined });

  if (result.code !== 1) {
    return { ok: false, message: result.message, errors: envelopeFieldErrors(result) };
  }

  revalidatePath("/agenda");
  return { ok: true, message: "Solicitação enviada." };
}
