"use server";

import { revalidatePath } from "next/cache";
import { envelopeFieldErrors } from "@/core/http/api-client";
import type { ActionState } from "@/shared/lib/action-state";
import { zodErrorsToRecord } from "@/shared/lib/action-state";
import { profileApi } from "../api/profile-api";
import { brandingInputSchema } from "../lib/branding-schema";

export async function saveBranding(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = brandingInputSchema.safeParse({
    brandColor: String(formData.get("brandColor") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, message: "Confira os campos.", errors: zodErrorsToRecord(parsed.error.issues) };
  }

  const result = await profileApi.updateBranding(parsed.data);
  if (result.code !== 1) {
    return { ok: false, message: result.message, errors: envelopeFieldErrors(result) };
  }

  revalidatePath("/perfil");
  return { ok: true, message: "Cor atualizada." };
}
