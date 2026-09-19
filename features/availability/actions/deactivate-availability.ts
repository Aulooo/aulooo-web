"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/shared/lib/action-state";
import { availabilityApi } from "../api/availability-api";

export async function deactivateAvailability(id: string): Promise<ActionState> {
  const result = await availabilityApi.deactivate(id);
  if (result.code !== 1) return { ok: false, message: result.message };

  revalidatePath("/disponibilidade");
  return { ok: true, message: "Disponibilidade desativada." };
}
