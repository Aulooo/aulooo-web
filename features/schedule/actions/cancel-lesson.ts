"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/shared/lib/action-state";
import { scheduleApi } from "../api/schedule-api";

export async function cancelLesson(classId: string): Promise<ActionState> {
  const result = await scheduleApi.cancelClass(classId);
  if (result.code !== 1) return { ok: false, message: result.message };

  revalidatePath("/agenda");
  revalidatePath("/home");
  return { ok: true, message: "Aula cancelada." };
}
