"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/shared/lib/action-state";
import { zodErrorsToRecord } from "@/shared/lib/action-state";
import { peopleDb } from "@/mock/db/people";
import { profileInputSchema } from "../lib/profile-schema";

/** personId é fixado via .bind(null, personId) no client. */
export async function updateProfile(
  personId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = profileInputSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    specialty: String(formData.get("specialty") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, message: "Confira os campos.", errors: zodErrorsToRecord(parsed.error.issues) };
  }

  const current = await peopleDb.get(personId);
  if (!current) return { ok: false, message: "Perfil não encontrado." };

  await peopleDb.patch(personId, {
    name: parsed.data.name,
    phone: parsed.data.phone,
    teacherProfile: current.roles.includes("professor")
      ? { specialty: parsed.data.specialty }
      : current.teacherProfile,
  });

  revalidatePath("/perfil");
  revalidatePath("/home");
  return { ok: true, message: "Perfil atualizado." };
}
