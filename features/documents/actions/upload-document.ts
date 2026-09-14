"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/shared/lib/action-state";
import { zodErrorsToRecord } from "@/shared/lib/action-state";
import { documentsDb } from "@/mock/db/documents";
import { documentInputSchema } from "../lib/document-schema";
import type { DocumentInput } from "../types";

function buildInput(formData: FormData) {
  const audience = String(formData.get("audience") ?? "all");
  return {
    title: String(formData.get("title") ?? ""),
    kind: String(formData.get("kind") ?? "link"),
    url: String(formData.get("url") ?? ""),
    audience,
    studentId:
      audience === "student" && formData.get("studentId") ? String(formData.get("studentId")) : null,
  };
}

/** authorId é fixado via .bind(null, authorId) no client. */
export async function saveDocument(
  authorId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = documentInputSchema.safeParse(buildInput(formData));
  if (!parsed.success) {
    return { ok: false, message: "Confira os campos.", errors: zodErrorsToRecord(parsed.error.issues) };
  }

  const doc = await documentsDb.create(authorId, parsed.data as DocumentInput);
  revalidatePath("/materiais");
  revalidatePath("/home");
  return { ok: true, id: doc.id, message: "Material publicado." };
}
