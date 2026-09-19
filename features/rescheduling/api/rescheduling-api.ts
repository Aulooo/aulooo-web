import { apiClient } from "@/core/http/api-client";
import type {
  Interval,
  ReschedulingPolicy,
  ReschedulingPolicyInput,
  ReschedulingRequestInput,
  ReschedulingRequestItem,
} from "../types";

type RawRequest = {
  requestId: string;
  classId: string;
  previousInterval: Interval;
  requestedInterval: Interval;
  status: string;
  reason: string | null;
  createdAt: string;
  decidedAt: string | null;
  decisionReason: string | null;
};

function toRequest({ requestId, ...rest }: RawRequest): ReschedulingRequestItem {
  return { id: requestId, ...rest };
}

export const reschedulingApi = {
  async createAsStudent(classId: string, input: ReschedulingRequestInput) {
    const res = await apiClient.post<RawRequest>(`/students/me/classes/${classId}/rescheduling-requests`, input);
    return { ...res, data: res.data ? toRequest(res.data) : null };
  },

  async listAsStudent() {
    const res = await apiClient.get<RawRequest[]>("/students/me/rescheduling-requests");
    return { ...res, data: res.data?.map(toRequest) ?? null };
  },

  async listAsProfessor() {
    const res = await apiClient.get<RawRequest[]>("/professors/me/rescheduling-requests");
    return { ...res, data: res.data?.map(toRequest) ?? null };
  },

  async approve(requestId: string) {
    const res = await apiClient.post<RawRequest>(`/professors/me/rescheduling-requests/${requestId}/approve`);
    return { ...res, data: res.data ? toRequest(res.data) : null };
  },

  async reject(requestId: string, reason?: string) {
    const res = await apiClient.post<RawRequest>(
      `/professors/me/rescheduling-requests/${requestId}/reject`,
      reason ? { reason } : undefined,
    );
    return { ...res, data: res.data ? toRequest(res.data) : null };
  },

  getPolicyAsProfessor: () => apiClient.get<ReschedulingPolicy>("/professors/me/rescheduling-policy"),

  updatePolicy: (input: ReschedulingPolicyInput) =>
    apiClient.patch<ReschedulingPolicy>("/professors/me/rescheduling-policy", input),
};
