import type { Person, PersonInput } from "@/features/people/types";
import { jsonStore, mockId } from "../json-store";
import { seedPeople } from "./seed-data";

const store = jsonStore<Person>("people", seedPeople);

function normalize(input: PersonInput) {
  return {
    ...input,
    email: input.email.trim().toLowerCase(),
    studentProfile: input.studentProfile ?? null,
    teacherProfile: input.teacherProfile ?? null,
  };
}

export const peopleDb = {
  list: store.list,
  get: store.get,

  async findByEmail(email: string): Promise<Person | null> {
    const target = email.trim().toLowerCase();
    return (await store.list()).find((p) => p.email.toLowerCase() === target) ?? null;
  },

  /** Alunos do tenant; se `teacherId` for passado, só os vinculados a ele. */
  async students(teacherId?: string): Promise<Person[]> {
    return store.where(
      (p) =>
        p.roles.includes("aluno") &&
        (!teacherId || p.studentProfile?.teacherId === teacherId),
    );
  },

  async teachers(): Promise<Person[]> {
    return store.where((p) => p.roles.includes("professor"));
  },

  async create(input: PersonInput): Promise<Person> {
    return store.insert({
      id: mockId("psn"),
      status: "active",
      avatarUrl: null,
      createdAt: new Date().toISOString(),
      ...normalize(input),
    });
  },

  async update(id: string, input: PersonInput): Promise<Person | null> {
    return store.patch(id, normalize(input));
  },

  async patch(id: string, patch: Partial<Person>): Promise<Person | null> {
    return store.patch(id, patch);
  },

  async setActive(id: string, active: boolean): Promise<Person | null> {
    return store.patch(id, { status: active ? "active" : "inactive" });
  },
};
