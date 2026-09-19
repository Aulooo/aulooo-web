import { apiClient } from "@/core/http/api-client";
import type { Availability, AvailabilityInput } from "../types";

type RawAvailability = {
  availabilityId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  status: string;
  timeZone: string;
};

function toAvailability({ availabilityId, ...rest }: RawAvailability): Availability {
  return { id: availabilityId, ...rest };
}

export const availabilityApi = {
  async list() {
    const res = await apiClient.get<RawAvailability[]>("/professors/me/availabilities");
    return { ...res, data: res.data?.map(toAvailability) ?? null };
  },

  async create(input: AvailabilityInput) {
    const res = await apiClient.post<RawAvailability>("/professors/me/availabilities", input);
    return { ...res, data: res.data ? toAvailability(res.data) : null };
  },

  async update(id: string, input: Partial<AvailabilityInput>) {
    const res = await apiClient.patch<RawAvailability>(`/professors/me/availabilities/${id}`, input);
    return { ...res, data: res.data ? toAvailability(res.data) : null };
  },

  async deactivate(id: string) {
    const res = await apiClient.post<RawAvailability>(`/professors/me/availabilities/${id}/deactivate`);
    return { ...res, data: res.data ? toAvailability(res.data) : null };
  },
};
