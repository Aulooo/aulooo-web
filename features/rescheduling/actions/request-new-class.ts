"use server";

import { revalidatePath } from "next/cache";
import { envelopeFieldErrors } from "@/core/http/api-client";
import type { ActionState } from "@/shared/lib/action-state";
import { zodErrorsToRecord } from "@/shared/lib/action-state";
import { reschedulingApi } from "../api/rescheduling-api";
import { schedulingRequestSchema } from "../lib/rescheduling-schema";

export async function requestNewClass(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = schedulingRequestSchema.safeParse({
    date: String(formData.get("date") ?? ""),
    startTime: String(formData.get("startTime") ?? ""),
    endTime: String(formData.get("endTime") ?? ""),
    reason: String(formData.get("reason") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, message: "Confira os campos.", errors: zodErrorsToRecord(parsed.error.issues) };
  }

  const { reason, ...rest } = parsed.data;
  const result = await reschedulingApi.createSchedulingRequest({ ...rest, reason: reason || undefined });

  if (result.code !== 1) {
    return { ok: false, message: result.message, errors: envelopeFieldErrors(result) };
  }

  revalidatePath("/agenda");
  return { ok: true, message: "Solicitação enviada." };
}
