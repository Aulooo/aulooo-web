"use server";

import { revalidatePath } from "next/cache";
import { peopleStore } from "@/mock/people-store";
import type { PersonActionState } from "../types";

export async function setPersonActive(
  id: string,
  active: boolean,
): Promise<PersonActionState> {
  const person = await peopleStore.setActive(id, active);
  if (!person) return { ok: false, message: "Pessoa não encontrada." };

  revalidatePath("/usuarios");
  return {
    ok: true,
    personId: id,
    message: active ? "Pessoa reativada." : "Pessoa desativada.",
  };
}
