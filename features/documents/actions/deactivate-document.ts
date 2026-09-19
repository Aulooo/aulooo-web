"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/shared/lib/action-state";
import { documentsApi } from "../api/documents-api";

export async function deactivateDocument(id: string): Promise<ActionState> {
  const result = await documentsApi.deactivate(id);
  if (result.code !== 1) return { ok: false, message: result.message };

  revalidatePath("/materiais");
  revalidatePath("/home");
  return { ok: true, message: "Material desativado." };
}
