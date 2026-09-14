"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/shared/lib/action-state";
import { announcementsDb } from "@/mock/db/announcements";

export async function deleteAnnouncement(id: string): Promise<ActionState> {
  await announcementsDb.remove(id);
  revalidatePath("/avisos");
  revalidatePath("/home");
  return { ok: true, message: "Aviso removido." };
}
