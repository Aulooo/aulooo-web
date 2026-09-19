import { reschedulingApi } from "../api/rescheduling-api";
import type { SchedulingRequestItem } from "../types";

export async function getMySchedulingRequests(role: "professor" | "aluno"): Promise<SchedulingRequestItem[]> {
  const res =
    role === "professor"
      ? await reschedulingApi.listSchedulingRequestsAsProfessor()
      : await reschedulingApi.listSchedulingRequestsAsStudent();
  if (res.code !== 1 || !res.data) {
    throw new Error(res.message || "Não foi possível carregar as solicitações de aula.");
  }
  return res.data;
}
