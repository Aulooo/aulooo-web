"use server";

import { revalidatePath } from "next/cache";
import { envelopeFieldErrors } from "@/core/http/api-client";
import type { ActionState } from "@/shared/lib/action-state";
import { zodErrorsToRecord } from "@/shared/lib/action-state";
import { announcementsApi } from "../api/announcements-api";
import { announcementInputSchema } from "../lib/announcement-schema";

export async function saveAnnouncement(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const parsed = announcementInputSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
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
