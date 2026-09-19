import { apiClient } from "@/core/http/api-client";
import type { Announcement, AnnouncementInput } from "../types";

type RawAnnouncement = {
  announcementId: string;
  title: string;
  content: string;
  status: Announcement["status"];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  audience: Announcement["audience"];
  recipientStudentIds: string[];
};

function toAnnouncement({ announcementId, ...rest }: RawAnnouncement): Announcement {
  return { id: announcementId, ...rest };
}

export const announcementsApi = {
  async listAsProfessor() {
    const res = await apiClient.get<RawAnnouncement[]>("/professors/me/announcements");
    return { ...res, data: res.data?.map(toAnnouncement) ?? null };
  },

  async listAsStudent() {
    const res = await apiClient.get<RawAnnouncement[]>("/students/me/announcements");
    return { ...res, data: res.data?.map(toAnnouncement) ?? null };
  },

  async create(input: AnnouncementInput) {
    const res = await apiClient.post<RawAnnouncement>("/professors/me/announcements", input);
    return { ...res, data: res.data ? toAnnouncement(res.data) : null };
  },

  async update(id: string, input: AnnouncementInput) {
    const res = await apiClient.patch<RawAnnouncement>(`/professors/me/announcements/${id}`, input);
    return { ...res, data: res.data ? toAnnouncement(res.data) : null };
  },

  async archive(id: string) {
    const res = await apiClient.post<RawAnnouncement>(`/professors/me/announcements/${id}/archive`);
    return { ...res, data: res.data ? toAnnouncement(res.data) : null };
  },
};
