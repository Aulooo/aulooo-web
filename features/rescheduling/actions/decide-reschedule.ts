"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/shared/lib/action-state";
import { reschedulingApi } from "../api/rescheduling-api";

export async function approveReschedule(requestId: string): Promise<ActionState> {
  const result = await reschedulingApi.approve(requestId);
  if (result.code !== 1) return { ok: false, message: result.message };

  revalidatePath("/reagendamentos");
  revalidatePath("/agenda");
  return { ok: true, message: "Reagendamento aprovado." };
}

export async function rejectReschedule(requestId: string, reason?: string): Promise<ActionState> {
  const result = await reschedulingApi.reject(requestId, reason);
  if (result.code !== 1) return { ok: false, message: result.message };

  revalidatePath("/reagendamentos");
  return { ok: true, message: "Reagendamento recusado." };
}
