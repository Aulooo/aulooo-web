"use server";

import { revalidatePath } from "next/cache";
import { envelopeFieldErrors } from "@/core/http/api-client";
import type { ActionState } from "@/shared/lib/action-state";
import { zodErrorsToRecord } from "@/shared/lib/action-state";
import { scheduleApi } from "../api/schedule-api";
import { createClassInputSchema, createSeriesInputSchema } from "../lib/lesson-schema";

export async function createLesson(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const kind = String(formData.get("kind") ?? "single");

  if (kind === "series") {
    const parsed = createSeriesInputSchema.safeParse({
      studentId: String(formData.get("studentId") ?? ""),
      dayOfWeek: String(formData.get("dayOfWeek") ?? ""),
      startTime: String(formData.get("startTime") ?? ""),
      endTime: String(formData.get("endTime") ?? ""),
      startDate: String(formData.get("startDate") ?? ""),
      endDate: String(formData.get("endDate") ?? ""),
    });

    if (!parsed.success) {
      return { ok: false, message: "Confira os campos.", errors: zodErrorsToRecord(parsed.error.issues) };
    }

    const result = await scheduleApi.createSeries(parsed.data);
    if (result.code !== 1) {
      return { ok: false, message: result.message, errors: envelopeFieldErrors(result) };
    }

    revalidatePath("/agenda");
    revalidatePath("/home");
    return { ok: true, message: "Série agendada." };
  }

  const parsed = createClassInputSchema.safeParse({
    studentId: String(formData.get("studentId") ?? ""),
    date: String(formData.get("date") ?? ""),
    startTime: String(formData.get("startTime") ?? ""),
    endTime: String(formData.get("endTime") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, message: "Confira os campos.", errors: zodErrorsToRecord(parsed.error.issues) };
  }

  const result = await scheduleApi.createClass(parsed.data);
  if (result.code !== 1) {
    return { ok: false, message: result.message, errors: envelopeFieldErrors(result) };
  }

  revalidatePath("/agenda");
  revalidatePath("/home");
  return { ok: true, id: result.data?.id, message: "Aula agendada." };
}
