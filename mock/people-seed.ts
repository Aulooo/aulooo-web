import type { Person, PersonStatus } from "@/features/people/types";
import { MOCK_STUDENTS } from "./students";
import { MOCK_TEACHERS } from "./teachers";

const status = (s: string): PersonStatus => (s === "inactive" ? "inactive" : "active");

/**
 * Seed inicial do `mock/people.data.json` — a partir dos alunos e professores
 * que já existem no mock, para a lista não começar vazia e os IDs baterem.
 */
export function seedPeople(): Person[] {
  const teachers: Person[] = MOCK_TEACHERS.map((t) => ({
    id: t.id,
    name: t.name,
    email: t.email,
    phone: "",
    document: "",
    birthDate: "",
    roles: ["professor"],
    status: status(t.status),
    avatarUrl: t.avatarUrl ?? null,
    studentProfile: null,
    teacherProfile: { specialty: "" },
    createdAt: t.joinedAt,
  }));

  const students: Person[] = MOCK_STUDENTS.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone,
    document: "",
    birthDate: "",
    roles: ["aluno"],
    status: status(s.status),
    avatarUrl: s.avatarUrl ?? null,
    studentProfile: {
      plan: s.plan,
      monthlyFeeCents: s.monthlyFeeCents,
      dueDay: s.dueDay,
      teacherId: s.teacherId,
    },
    teacherProfile: null,
    createdAt: s.joinedAt,
  }));

  return [...teachers, ...students];
}
