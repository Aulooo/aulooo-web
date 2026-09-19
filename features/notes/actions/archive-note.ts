"use server";

import type { ActionState } from "@/shared/lib/action-state";
import { notesApi } from "../api/notes-api";

export async function archiveNote(id: string): Promise<ActionState> {
  const result = await notesApi.archive(id);
  if (result.code !== 1) return { ok: false, message: result.message };

  return { ok: true, message: "Observação arquivada." };
}
