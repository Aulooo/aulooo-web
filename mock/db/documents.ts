import type { DocumentInput, StudyDocument } from "@/features/documents";
import { jsonStore, mockId } from "../json-store";
import { seedDocuments } from "./seed-data";

const store = jsonStore<StudyDocument>("documents", seedDocuments);

export const documentsDb = {
  list: store.list,
  get: store.get,

  async forStudent(studentId: string): Promise<StudyDocument[]> {
    return store.where((d) => d.audience === "all" || d.studentId === studentId);
  },

  async byAuthor(authorId: string): Promise<StudyDocument[]> {
    return store.where((d) => d.authorId === authorId);
  },

  async create(authorId: string, input: DocumentInput): Promise<StudyDocument> {
    return store.insert({
      id: mockId("doc"),
      authorId,
      uploadedAt: new Date().toISOString(),
      sizeBytes: null,
      ...input,
      studentId: input.audience === "student" ? input.studentId : null,
    });
  },

  async remove(id: string): Promise<void> {
    return store.remove(id);
  },
};
