"use server";

import { revalidatePath } from "next/cache";
import { envelopeFieldErrors } from "@/core/http/api-client";
import type { ActionState } from "@/shared/lib/action-state";
import { documentsApi } from "../api/documents-api";

const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "xls", "xlsx", "csv"];

export async function uploadDocument(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const studentId = String(formData.get("studentId") ?? "");
  const file = formData.get("file");

  if (!studentId) {
    return { ok: false, message: "Confira os campos.", errors: { studentId: "Escolha o aluno" } };
  }

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Confira os campos.", errors: { file: "Escolha um arquivo" } };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      ok: false,
      message: "Confira os campos.",
      errors: { file: "Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX, CSV" },
    };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { ok: false, message: "Confira os campos.", errors: { file: "Arquivo maior que 10 MB" } };
  }

  const form = new FormData();
  form.append("file", file);

  const result = await documentsApi.upload(studentId, form);
  if (result.code !== 1) {
    return { ok: false, message: result.message, errors: envelopeFieldErrors(result) };
  }

  revalidatePath("/materiais");
  revalidatePath("/home");
  return { ok: true, id: result.data?.id, message: "Material enviado." };
}
