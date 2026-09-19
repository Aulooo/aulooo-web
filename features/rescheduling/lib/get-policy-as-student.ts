import { reschedulingApi } from "../api/rescheduling-api";
import type { ReschedulingPolicy } from "../types";

/** Não lança em falha — usado só pra decidir se mostra o botão "Solicitar aula". */
export async function getPolicyAsStudent(): Promise<ReschedulingPolicy | null> {
  const res = await reschedulingApi.getPolicyAsStudent();
  return res.code === 1 && res.data ? res.data : null;
}
