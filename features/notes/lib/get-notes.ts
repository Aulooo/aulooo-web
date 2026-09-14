import { notesApi } from "../api/notes-api";
import type { PrivateNote } from "../types";

export async function getNotesForStudent(studentId: string): Promise<PrivateNote[]> {
  const res = await notesApi.listForStudent(studentId);
  if (res.code !== 1 || !res.data) {
    throw new Error(res.message || "Não foi possível carregar as observações.");
  }
  return res.data;
}
