"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/shared/lib/action-state";
import { zodErrorsToRecord } from "@/shared/lib/action-state";
import { lessonsDb } from "@/mock/db/lessons";
import { lessonInputSchema } from "../lib/lesson-schema";
import type { LessonInput } from "../types";

function buildInput(formData: FormData) {
  const raw = String(formData.get("startsAt") ?? "");
  const studentId = String(formData.get("studentId") ?? "");
  return {
    title: String(formData.get("title") ?? ""),
    startsAt: raw ? new Date(raw).toISOString() : "",
    durationMin: Number.parseInt(String(formData.get("durationMin") ?? ""), 10),
    mode: String(formData.get("mode") ?? "in_person"),
    location: String(formData.get("location") ?? "").trim() || null,
    studentId: studentId && studentId !== "turma" ? studentId : null,
  };
}

/** teacherId é fixado via .bind(null, teacherId) no client. */
export async function saveLesson(
  teacherId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const parsed = lessonInputSchema.safeParse(buildInput(formData));

  if (!parsed.success) {
    return { ok: false, message: "Confira os campos.", errors: zodErrorsToRecord(parsed.error.issues) };
  }

  const input = parsed.data as LessonInput;
  const saved = id ? await lessonsDb.update(id, input) : await lessonsDb.create(teacherId, input);
  if (!saved) return { ok: false, message: "Aula não encontrada." };

  revalidatePath("/agenda");
  revalidatePath("/home");
  return { ok: true, id: saved.id, message: id ? "Aula atualizada." : "Aula agendada." };
}
