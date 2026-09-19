import { apiClient } from "@/core/http/api-client";
import type { NoteInput, PrivateNote } from "../types";

type RawNote = {
  noteId: string;
  studentId: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

function toNote({ noteId, ...rest }: RawNote): PrivateNote {
  return { id: noteId, ...rest };
}

export const notesApi = {
  async listForStudent(studentId: string) {
    const res = await apiClient.get<RawNote[]>(`/professors/me/students/${studentId}/notes`);
    return { ...res, data: res.data?.map(toNote) ?? null };
  },

  async create(studentId: string, input: NoteInput) {
    const res = await apiClient.post<RawNote>(`/professors/me/students/${studentId}/notes`, input);
    return { ...res, data: res.data ? toNote(res.data) : null };
  },

  async update(noteId: string, input: NoteInput) {
    const res = await apiClient.patch<RawNote>(`/professors/me/notes/${noteId}`, input);
    return { ...res, data: res.data ? toNote(res.data) : null };
  },

  async archive(noteId: string) {
    const res = await apiClient.post<RawNote>(`/professors/me/notes/${noteId}/archive`);
    return { ...res, data: res.data ? toNote(res.data) : null };
  },
};
