"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/shared/lib/action-state";
import { documentsApi } from "../api/documents-api";

const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "xls", "xlsx", "csv"];

export async function uploadDocument(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const studentIds = String(formData.get("studentIds") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const file = formData.get("file");

  if (studentIds.length === 0) {
    return { ok: false, message: "Confira os campos.", errors: { studentIds: "Escolha ao menos um aluno" } };
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

  // Um material = um destinatário no backend (sem "turma toda" no modelo). Pra
  // vários alunos ou "todos", enviamos o mesmo arquivo uma vez por aluno.
  const failures: string[] = [];
  for (const studentId of studentIds) {
    const form = new FormData();
    form.append("file", file);
    const result = await documentsApi.upload(studentId, form);
    if (result.code !== 1) failures.push(result.message || studentId);
  }

  revalidatePath("/materiais");
  revalidatePath("/home");

  if (failures.length === studentIds.length) {
    return { ok: false, message: `Falha ao enviar: ${failures[0]}` };
  }
  if (failures.length > 0) {
    return {
      ok: true,
      message: `Enviado para ${studentIds.length - failures.length} de ${studentIds.length} alunos. Falhas: ${failures.join(", ")}`,
    };
  }

  return {
    ok: true,
    message: studentIds.length > 1 ? `Material enviado para ${studentIds.length} alunos.` : "Material enviado.",
  };
}
