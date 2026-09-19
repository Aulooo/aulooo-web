"use server";

import { adminApi } from "../api/admin-api";
import type { GenerateEntryCodeState } from "./generate-professor-entry-code";

export async function generateStudentEntryCodeForProfessor(professorId: string): Promise<GenerateEntryCodeState> {
  const result = await adminApi.generateStudentEntryCode(professorId);
  if (result.code !== 1 || !result.data) {
    return { ok: false, message: result.message };
  }

  return { ok: true, code: result.data.code, expiresAt: result.data.expiresAt };
}
