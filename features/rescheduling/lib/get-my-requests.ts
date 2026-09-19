import { reschedulingApi } from "../api/rescheduling-api";
import type { ReschedulingRequestItem } from "../types";

export async function getMyRequests(role: "professor" | "aluno"): Promise<ReschedulingRequestItem[]> {
  const res = role === "professor" ? await reschedulingApi.listAsProfessor() : await reschedulingApi.listAsStudent();
  if (res.code !== 1 || !res.data) {
    throw new Error(res.message || "Não foi possível carregar as solicitações.");
  }
  return res.data;
}
