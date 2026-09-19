import { scheduleApi } from "../api/schedule-api";
import type { AvailabilitySlot } from "../types";

/** Não lança em falha — é conteúdo de apoio pro formulário de solicitar aula, não crítico. */
export async function getStudentSlots(from: string, to: string): Promise<AvailabilitySlot[]> {
  const res = await scheduleApi.getStudentSlots(from, to);
  return res.code === 1 ? (res.data ?? []) : [];
}
