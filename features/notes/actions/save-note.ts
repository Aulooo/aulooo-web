"use server";

import { revalidatePath } from "next/cache";
import { envelopeFieldErrors } from "@/core/http/api-client";
import type { ActionState } from "@/shared/lib/action-state";
import { zodErrorsToRecord } from "@/shared/lib/action-state";
import { notesApi } from "../api/notes-api";
import { noteInputSchema } from "../lib/note-schema";

export async function saveNote(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const studentId = String(formData.get("studentId") ?? "");
  const id = formData.get("id") ? String(formData.get("id")) : null;

  if (!studentId) return { ok: false, message: "Aluno inválido." };

  const parsed = noteInputSchema.safeParse({ content: String(formData.get("content") ?? "") });
  if (!parsed.success) {
    return { ok: false, message: "Confira os campos.", errors: zodErrorsToRecord(parsed.error.issues) };
  }

  const result = id
    ? await notesApi.update(id, parsed.data)
    : await notesApi.create(studentId, parsed.data);

  if (result.code !== 1) {
    return { ok: false, message: result.message, errors: envelopeFieldErrors(result) };
  }

  return { ok: true, id: result.data?.id, message: id ? "Observação atualizada." : "Observação criada." };
}
