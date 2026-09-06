import type { Role } from "@/features/auth";

/** Papel da pessoa no tenant — mesmo conceito de `Role` (admin / professor / aluno). */
export type PersonRole = Role;

export type PersonStatus = "active" | "inactive";

/** Dados extras quando a pessoa tem o papel de aluno no tenant. */
export type StudentProfile = {
  plan: string;
  monthlyFeeCents: number;
  dueDay: number;
  /** Professor responsável (Person.id) ou null. */
  teacherId: string | null;
};

/** Dados extras quando a pessoa tem o papel de professor no tenant. */
export type TeacherProfile = {
  specialty: string;
};

export type Person = {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** CPF. */
  document: string;
  /** Data de nascimento (YYYY-MM-DD). */
  birthDate: string;
  roles: PersonRole[];
  status: PersonStatus;
  avatarUrl?: string | null;
  studentProfile?: StudentProfile | null;
  teacherProfile?: TeacherProfile | null;
  createdAt: string;
};

/** O que a Server Action recebe para criar/editar. */
export type PersonInput = {
  name: string;
  email: string;
  phone: string;
  document: string;
  birthDate: string;
  roles: PersonRole[];
  studentProfile?: StudentProfile | null;
  teacherProfile?: TeacherProfile | null;
};

/** Resultado das actions, consumido por `useActionState`. */
export type PersonActionState = {
  ok: boolean;
  message?: string;
  /** Erros por campo (ex.: `{ email: "E-mail inválido" }`). */
  errors?: Record<string, string>;
  /** Id da pessoa criada/editada, quando ok. */
  personId?: string;
};
