"use server";

import { revalidatePath } from "next/cache";
import { peopleStore } from "@/mock/people-store";
import { personInputSchema } from "../lib/person-schema";
import type { PersonActionState, PersonInput, PersonRole } from "../types";

function normalizeTeacherId(raw: string): string | null {
  return raw && raw !== "none" ? raw : null;
}

function parseMoneyToCents(raw: string): number {
  const cleaned = raw.replace(/[\sR$]/g, "").replace(/\./g, "").replace(",", ".");
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) ? Math.round(value * 100) : Number.NaN;
}

function buildInput(formData: FormData): PersonInput {
  const roles = formData.getAll("roles").map(String) as PersonRole[];

  return {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    document: String(formData.get("document") ?? ""),
    birthDate: String(formData.get("birthDate") ?? ""),
    roles,
    studentProfile: roles.includes("aluno")
      ? {
          plan: String(formData.get("plan") ?? ""),
          monthlyFeeCents: parseMoneyToCents(String(formData.get("monthlyFee") ?? "")),
          dueDay: Number.parseInt(String(formData.get("dueDay") ?? ""), 10),
          teacherId: normalizeTeacherId(String(formData.get("teacherId") ?? "")),
        }
      : null,
    teacherProfile: roles.includes("professor")
      ? { specialty: String(formData.get("specialty") ?? "") }
      : null,
  };
}

/** Cria (sem `id` no form) ou edita (com `id`) uma pessoa. */
export async function savePerson(
  _prev: PersonActionState,
  formData: FormData,
): Promise<PersonActionState> {
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const parsed = personInputSchema.safeParse(buildInput(formData));

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, message: "Confira os campos destacados.", errors };
  }

  const existing = await peopleStore.findByEmail(parsed.data.email);
  if (existing && existing.id !== id) {
    return { ok: false, errors: { email: "Já existe uma pessoa com esse e-mail." } };
  }

  const data = parsed.data as PersonInput;
  const person = id ? await peopleStore.update(id, data) : await peopleStore.create(data);
  if (!person) return { ok: false, message: "Pessoa não encontrada." };

  revalidatePath("/usuarios");
  return {
    ok: true,
    personId: person.id,
    message: id ? "Alterações salvas." : "Pessoa cadastrada.",
  };
}
