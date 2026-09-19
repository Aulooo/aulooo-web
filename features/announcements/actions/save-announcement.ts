"use server";

import { revalidatePath } from "next/cache";
import { envelopeFieldErrors } from "@/core/http/api-client";
import type { ActionState } from "@/shared/lib/action-state";
import { zodErrorsToRecord } from "@/shared/lib/action-state";
import { announcementsApi } from "../api/announcements-api";
import { announcementInputSchema } from "../lib/announcement-schema";

export async function saveAnnouncement(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get("id") ? String(formData.get("id")) : null;
  // Destinatários só fazem sentido na criação — o backend fixa no comunicado
  // e ignora em updates, então nem lemos o campo ao editar. "__all__" (ver
  // RecipientPickerField com allMeansBroadcast) mantém o alcance dinâmico
  // padrão — nesse caso não mandamos lista nenhuma pra API.
  const rawRecipients = String(formData.get("studentIds") ?? "");
  const recipientStudentIds =
    id || rawRecipients === "__all__"
      ? undefined
      : rawRecipients
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);

  if (!id && recipientStudentIds && recipientStudentIds.length === 0) {
    return {
      ok: false,
      message: "Confira os campos.",
      errors: { studentIds: "Escolha \"Todos\" ou ao menos um aluno" },
    };
  }

  const parsed = announcementInputSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
    recipientStudentIds,
  });

  if (!parsed.success) {
    return { ok: false, message: "Confira os campos.", errors: zodErrorsToRecord(parsed.error.issues) };
  }

  const result = id
    ? await announcementsApi.update(id, parsed.data)
    : await announcementsApi.create(parsed.data);

  if (result.code !== 1) {
    return { ok: false, message: result.message, errors: envelopeFieldErrors(result) };
  }

  revalidatePath("/avisos");
  revalidatePath("/home");
  return { ok: true, id: result.data?.id, message: id ? "Aviso atualizado." : "Aviso publicado." };
}
