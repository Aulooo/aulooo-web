"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/shared/lib/action-state";
import { lessonsDb } from "@/mock/db/lessons";

export async function cancelLesson(id: string): Promise<ActionState> {
  const lesson = await lessonsDb.cancel(id);
  if (!lesson) return { ok: false, message: "Aula não encontrada." };
  revalidatePath("/agenda");
  revalidatePath("/home");
  return { ok: true, message: "Aula cancelada." };
}
