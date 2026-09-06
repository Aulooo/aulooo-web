import type { Announcement, AnnouncementInput } from "@/features/announcements";
import { jsonStore, mockId } from "../json-store";
import { seedAnnouncements } from "./seed-data";

const store = jsonStore<Announcement>("announcements", seedAnnouncements);

export const announcementsDb = {
  list: store.list,
  get: store.get,

  /** Avisos que um aluno enxerga: turma ("all") + os direcionados a ele. */
  async forStudent(studentId: string): Promise<Announcement[]> {
    return store.where((a) => a.audience === "all" || a.studentId === studentId);
  },

  async byAuthor(authorId: string): Promise<Announcement[]> {
    return store.where((a) => a.authorId === authorId);
  },

  async create(authorId: string, input: AnnouncementInput): Promise<Announcement> {
    return store.insert({
      id: mockId("ann"),
      authorId,
      publishedAt: new Date().toISOString(),
      ...input,
      studentId: input.audience === "student" ? input.studentId : null,
    });
  },

  async update(id: string, input: AnnouncementInput): Promise<Announcement | null> {
    return store.patch(id, {
      ...input,
      studentId: input.audience === "student" ? input.studentId : null,
    });
  },

  async remove(id: string): Promise<void> {
    return store.remove(id);
  },
};
