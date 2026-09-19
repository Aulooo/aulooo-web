"use server";

import { studentsApi } from "../api/students-api";

export type GenerateEntryCodeState = {
  ok: boolean;
  message?: string;
  code?: string;
  expiresAt?: string;
};

export async function generateEntryCode(): Promise<GenerateEntryCodeState> {
  const result = await studentsApi.generateEntryCode();
  if (result.code !== 1 || !result.data) {
    return { ok: false, message: result.message };
  }

  return { ok: true, code: result.data.code, expiresAt: result.data.expiresAt };
}
