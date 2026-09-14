"use server";

import { revalidatePath } from "next/cache";
import { envelopeFieldErrors } from "@/core/http/api-client";
import type { ActionState } from "@/shared/lib/action-state";
import { zodErrorsToRecord } from "@/shared/lib/action-state";
import { profileApi } from "../api/profile-api";
import { professorProfileInputSchema, studentProfileInputSchema } from "../lib/profile-schema";
import type { ProfileRole } from "../types";

/** role/currentEmail são fixados via .bind(null, role, currentEmail) no client. */
export async function updateProfile(
  role: ProfileRole,
  currentEmail: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    dateOfBirth: String(formData.get("dateOfBirth") ?? ""),
    ...(role === "professor"
      ? {
          professionalRegistration: String(formData.get("professionalRegistration") ?? ""),
          professionalDescription: String(formData.get("professionalDescription") ?? ""),
        }
      : { objective: String(formData.get("objective") ?? "") }),
  };

  const parsed =
    role === "professor"
      ? professorProfileInputSchema.safeParse(raw)
      : studentProfileInputSchema.safeParse(raw);

  if (!parsed.success) {
    return { ok: false, message: "Confira os campos.", errors: zodErrorsToRecord(parsed.error.issues) };
  }

  const { email, ...profileInput } = parsed.data;

  const profileResult =
    role === "professor"
      ? await profileApi.updateProfessorProfile(profileInput)
      : await profileApi.updateStudentProfile(profileInput);

  if (profileResult.code !== 1) {
    return {
      ok: false,
      message: profileResult.message,
      errors: envelopeFieldErrors(profileResult),
    };
  }

  if (email !== currentEmail) {
    const emailResult = await profileApi.updateEmail(email);
    if (emailResult.code !== 1) {
      return { ok: false, message: emailResult.message, errors: envelopeFieldErrors(emailResult) };
    }
  }

  revalidatePath("/perfil");
  revalidatePath("/home");
  return { ok: true, message: "Perfil atualizado." };
}
