"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/shared/lib/action-state";
import { reschedulingApi } from "../api/rescheduling-api";

export async function approveSchedulingRequest(requestId: string): Promise<ActionState> {
  const result = await reschedulingApi.approveSchedulingRequest(requestId);
  if (result.code !== 1) return { ok: false, message: result.message };

  revalidatePath("/reagendamentos");
  revalidatePath("/agenda");
  return { ok: true, message: "Aula aprovada." };
}

export async function rejectSchedulingRequest(requestId: string, reason?: string): Promise<ActionState> {
  const result = await reschedulingApi.rejectSchedulingRequest(requestId, reason);
  if (result.code !== 1) return { ok: false, message: result.message };

  revalidatePath("/reagendamentos");
  return { ok: true, message: "Solicitação recusada." };
}
