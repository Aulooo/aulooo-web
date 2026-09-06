import type { Lesson, LessonInput } from "@/features/schedule";
import { jsonStore, mockId } from "../json-store";
import { seedLessons } from "./seed-data";

const store = jsonStore<Lesson>("lessons", seedLessons);

export const lessonsDb = {
  list: store.list,
  get: store.get,

  async forTeacher(teacherId: string): Promise<Lesson[]> {
    return store.where((l) => l.teacherId === teacherId);
  },

  /** Aulas de um aluno (inclui as de turma, studentId null). */
  async forStudent(studentId: string): Promise<Lesson[]> {
    return store.where((l) => l.studentId === studentId || l.studentId === null);
  },

  async create(teacherId: string, input: LessonInput): Promise<Lesson> {
    return store.insert({
      id: mockId("les"),
      status: "scheduled",
      createdAt: new Date().toISOString(),
      teacherId,
      ...input,
      location: input.location ?? null,
    });
  },

  async update(id: string, input: LessonInput): Promise<Lesson | null> {
    return store.patch(id, { ...input, location: input.location ?? null });
  },

  async cancel(id: string): Promise<Lesson | null> {
    return store.patch(id, { status: "canceled" });
  },

  async remove(id: string): Promise<void> {
    return store.remove(id);
  },
};
