import { profileApi } from "../api/profile-api";
import type { ProfessorBranding } from "../types";

export async function getMyBranding(): Promise<ProfessorBranding> {
  const res = await profileApi.getBranding();
  if (res.code !== 1 || !res.data) {
    throw new Error(res.message || "Não foi possível carregar a identidade visual.");
  }
  return res.data;
}
