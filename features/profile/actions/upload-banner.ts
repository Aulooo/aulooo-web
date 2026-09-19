"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/shared/lib/action-state";
import { profileApi } from "../api/profile-api";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function uploadBanner(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Escolha uma imagem.", errors: { file: "Escolha uma imagem" } };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, message: "Confira o arquivo.", errors: { file: "Use JPG, PNG ou WEBP" } };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { ok: false, message: "Confira o arquivo.", errors: { file: "Imagem maior que 5 MB" } };
  }

  const form = new FormData();
  form.append("file", file);

  const result = await profileApi.uploadBanner(form);
  if (result.code !== 1) {
    return { ok: false, message: result.message };
  }

  revalidatePath("/perfil");
  return { ok: true, message: "Banner atualizado." };
}
