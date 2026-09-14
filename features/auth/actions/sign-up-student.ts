"use server";

import { redirect } from "next/navigation";
import { envelopeFieldErrors } from "@/core/http/api-client";
import type { ActionState } from "@/shared/lib/action-state";
import { zodErrorsToRecord } from "@/shared/lib/action-state";
import { authApi } from "../api/auth-api";
import { applyAuthSuccess } from "../lib/apply-auth-success";
import { signUpStudentSchema } from "../validator/sign-up-student-validator";

export async function signUpStudent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signUpStudentSchema.safeParse({
    entryCode: String(formData.get("entryCode") ?? ""),
    name: String(formData.get("name") ?? ""),
    cpf: String(formData.get("cpf") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    dateOfBirth: String(formData.get("dateOfBirth") ?? ""),
    objective: String(formData.get("objective") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, message: "Confira os campos.", errors: zodErrorsToRecord(parsed.error.issues) };
  }

  const { phone, dateOfBirth, objective, ...rest } = parsed.data;
  const response = await authApi.signUpStudent({
    ...rest,
    phone: phone || undefined,
    dateOfBirth: dateOfBirth || undefined,
    objective: objective || undefined,
  });

  if (response.code === 1 && response.data) {
    await applyAuthSuccess(response.data);
    redirect("/home");
  }

  return { ok: false, message: response.message, errors: envelopeFieldErrors(response) };
}
