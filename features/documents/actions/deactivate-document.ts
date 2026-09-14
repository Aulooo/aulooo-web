"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/shared/lib/action-state";
import { documentsDb } from "@/mock/db/documents";

export async function deleteDocument(id: string): Promise<ActionState> {
  await documentsDb.remove(id);
  revalidatePath("/materiais");
  revalidatePath("/home");
  return { ok: true, message: "Material removido." };
}
