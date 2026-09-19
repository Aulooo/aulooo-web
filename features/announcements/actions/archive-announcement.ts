"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/shared/lib/action-state";
import { announcementsApi } from "../api/announcements-api";

export async function archiveAnnouncement(id: string): Promise<ActionState> {
  const result = await announcementsApi.archive(id);
  if (result.code !== 1) return { ok: false, message: result.message };

  revalidatePath("/avisos");
  revalidatePath("/home");
  return { ok: true, message: "Aviso arquivado." };
}
