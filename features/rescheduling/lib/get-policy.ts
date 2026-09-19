import { reschedulingApi } from "../api/rescheduling-api";
import type { ReschedulingPolicy } from "../types";

export async function getPolicy(): Promise<ReschedulingPolicy> {
  const res = await reschedulingApi.getPolicyAsProfessor();
  if (res.code !== 1 || !res.data) {
    throw new Error(res.message || "Não foi possível carregar a política de reagendamento.");
  }
  return res.data;
}
