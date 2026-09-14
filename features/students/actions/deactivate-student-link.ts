"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/shared/lib/action-state";
import { studentsApi } from "../api/students-api";

export async function deactivateStudentLink(studentId: string): Promise<ActionState> {
  const result = await studentsApi.deactivateLink(studentId);
  if (result.code !== 1) return { ok: false, message: result.message };

  revalidatePath("/alunos");
  return { ok: true, message: "Vínculo desativado." };
}
