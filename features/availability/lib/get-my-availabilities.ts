import { availabilityApi } from "../api/availability-api";
import type { Availability } from "../types";

export async function getMyAvailabilities(): Promise<Availability[]> {
  const res = await availabilityApi.list();
  if (res.code !== 1 || !res.data) {
    throw new Error(res.message || "Não foi possível carregar a disponibilidade.");
  }
  return res.data;
}
