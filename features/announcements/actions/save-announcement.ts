"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/shared/lib/action-state";
import { zodErrorsToRecord } from "@/shared/lib/action-state";
import { announcementsDb } from "@/mock/db/announcements";
import { announcementInputSchema } from "../lib/announcement-schema";
import type { AnnouncementInput } from "../types";

function buildInput(formData: FormData) {
  const audience = String(formData.get("audience") ?? "all");
  return {
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    audience,
    studentId: audience === "student" && formData.get("studentId") ? String(formData.get("studentId")) : null,
    pinned: formData.get("pinned") === "on",
  };
}

/** authorId é fixado via .bind(null, authorId) no client. */
export async function saveAnnouncement(
  authorId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const parsed = announcementInputSchema.safeParse(buildInput(formData));

  if (!parsed.success) {
    return { ok: false, message: "Confira os campos.", errors: zodErrorsToRecord(parsed.error.issues) };
  }

  const input = parsed.data as AnnouncementInput;
  const saved = id
    ? await announcementsDb.update(id, input)
    : await announcementsDb.create(authorId, input);
  if (!saved) return { ok: false, message: "Aviso não encontrado." };

  revalidatePath("/avisos");
  revalidatePath("/home");
  return { ok: true, id: saved.id, message: id ? "Aviso atualizado." : "Aviso publicado." };
}
