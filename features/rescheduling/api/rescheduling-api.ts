import { apiClient } from "@/core/http/api-client";
import type {
  Interval,
  ReschedulingPolicy,
  ReschedulingPolicyInput,
  ReschedulingRequestInput,
  ReschedulingRequestItem,
  SchedulingRequestInput,
  SchedulingRequestItem,
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

type RawSchedulingRequest = {
  requestId: string;
  studentId: string;
  requestedInterval: Interval;
  status: string;
  reason: string | null;
  createdAt: string;
  decidedAt: string | null;
  decisionReason: string | null;
  classId: string | null;
};

function toSchedulingRequest({ requestId, ...rest }: RawSchedulingRequest): SchedulingRequestItem {
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

  getPolicyAsStudent: () => apiClient.get<ReschedulingPolicy>("/students/me/rescheduling-policy"),

  updatePolicy: (input: ReschedulingPolicyInput) =>
    apiClient.patch<ReschedulingPolicy>("/professors/me/rescheduling-policy", input),

  async createSchedulingRequest(input: SchedulingRequestInput) {
    const res = await apiClient.post<RawSchedulingRequest>("/students/me/scheduling-requests", input);
    return { ...res, data: res.data ? toSchedulingRequest(res.data) : null };
  },

  async listSchedulingRequestsAsStudent() {
    const res = await apiClient.get<RawSchedulingRequest[]>("/students/me/scheduling-requests");
    return { ...res, data: res.data?.map(toSchedulingRequest) ?? null };
  },

  async listSchedulingRequestsAsProfessor() {
    const res = await apiClient.get<RawSchedulingRequest[]>("/professors/me/scheduling-requests");
    return { ...res, data: res.data?.map(toSchedulingRequest) ?? null };
  },

  async approveSchedulingRequest(requestId: string) {
    const res = await apiClient.post<RawSchedulingRequest>(`/professors/me/scheduling-requests/${requestId}/approve`);
    return { ...res, data: res.data ? toSchedulingRequest(res.data) : null };
  },

  async rejectSchedulingRequest(requestId: string, reason?: string) {
    const res = await apiClient.post<RawSchedulingRequest>(
      `/professors/me/scheduling-requests/${requestId}/reject`,
      reason ? { reason } : undefined,
    );
    return { ...res, data: res.data ? toSchedulingRequest(res.data) : null };
  },
};
