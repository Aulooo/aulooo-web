"use server";

import { revalidatePath } from "next/cache";
import { peopleDb } from "@/mock/db/people";
import type { PersonActionState } from "../types";

export async function setPersonActive(
  id: string,
  active: boolean,
): Promise<PersonActionState> {
  const person = await peopleDb.setActive(id, active);
  if (!person) return { ok: false, message: "Pessoa não encontrada." };

  revalidatePath("/usuarios");
  revalidatePath("/alunos");
  return {
    ok: true,
    personId: id,
    message: active ? "Pessoa reativada." : "Pessoa desativada.",
  };
}
