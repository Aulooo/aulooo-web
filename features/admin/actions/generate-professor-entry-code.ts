"use server";

import { adminApi } from "../api/admin-api";

export type GenerateEntryCodeState = {
  ok: boolean;
  message?: string;
  code?: string;
  expiresAt?: string;
};

export async function generateProfessorEntryCode(): Promise<GenerateEntryCodeState> {
  const result = await adminApi.generateProfessorEntryCode();
  if (result.code !== 1 || !result.data) {
    return { ok: false, message: result.message };
  }

  return { ok: true, code: result.data.code, expiresAt: result.data.expiresAt };
}
