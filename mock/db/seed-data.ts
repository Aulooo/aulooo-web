import type { Announcement } from "@/features/announcements";
import type { StudyDocument } from "@/features/documents";
import type { Payment, PaymentStatus } from "@/features/payments";
import type { Person, PersonStatus } from "@/features/people/types";
import type { Lesson } from "@/features/schedule";
import { dueDate, isoIn, monthKey } from "../_helpers";
import { MOCK_STUDENTS, MOCK_TEACHER_ID } from "../students";
import { MOCK_TEACHERS } from "../teachers";

const asStatus = (s: string): PersonStatus => (s === "inactive" ? "inactive" : "active");

const TEACHER_SPECIALTY: Record<string, string> = {
  usr_prof: "Treinamento funcional",
  tch_02: "Pilates",
  tch_03: "Musculação",
  tch_04: "Corrida",
};

/** Pessoas: admin da conta + professores + alunos, com os perfis embutidos. */
export function seedPeople(): Person[] {
  const admin: Person = {
    id: "usr_admin",
    name: "Marina Alves",
    email: "marina@studioalves.com.br",
    phone: "",
    document: "",
    birthDate: "",
    roles: ["admin"],
    status: "active",
    avatarUrl: null,
    studentProfile: null,
    teacherProfile: null,
    createdAt: isoIn(-900),
  };

  const teachers: Person[] = MOCK_TEACHERS.map((t) => ({
    id: t.id,
    name: t.name,
    email: t.email,
    phone: "(11) 90000-0000",
    document: "",
    birthDate: "",
    roles: ["professor"],
    status: asStatus(t.status),
    avatarUrl: t.avatarUrl ?? null,
    studentProfile: null,
    teacherProfile: { specialty: TEACHER_SPECIALTY[t.id] ?? "Educação física" },
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
    status: asStatus(s.status),
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

  return [admin, ...teachers, ...students];
}

export function seedLessons(): Lesson[] {
  const base = [
    { id: "les_01", title: "Treino — Beatriz Lima", startsAt: isoIn(0, 18), durationMin: 60, mode: "in_person", location: "Sala 2", studentId: "usr_aluno" },
    { id: "les_02", title: "Treino — Caio Ferreira", startsAt: isoIn(0, 19), durationMin: 60, mode: "in_person", location: "Sala 2", studentId: "std_02" },
    { id: "les_03", title: "Turma HIIT", startsAt: isoIn(1, 7), durationMin: 45, mode: "in_person", location: "Sala 1", studentId: null },
    { id: "les_04", title: "Consultoria online — Marina Duarte", startsAt: isoIn(1, 12), durationMin: 30, mode: "online", location: "https://meet.google.com/abc-defg-hij", studentId: "std_03" },
    { id: "les_05", title: "Treino — Beatriz Lima", startsAt: isoIn(3, 18), durationMin: 60, mode: "in_person", location: "Sala 2", studentId: "usr_aluno" },
    { id: "les_06", title: "Treino — Helena Rocha", startsAt: isoIn(4, 8), durationMin: 60, mode: "in_person", location: "Sala 3", studentId: "std_05" },
    { id: "les_00", title: "Treino — Beatriz Lima", startsAt: isoIn(-3, 18), durationMin: 60, mode: "in_person", location: "Sala 2", studentId: "usr_aluno" },
  ] as const;

  return base.map((l) => ({
    ...l,
    mode: l.mode as Lesson["mode"],
    teacherId: MOCK_TEACHER_ID,
    status: new Date(l.startsAt).getTime() < Date.now() ? "done" : "scheduled",
    createdAt: isoIn(-20),
  }));
}

export function seedAnnouncements(): Announcement[] {
  return [
    { id: "ann_01", title: "Feriado: sem aulas na sexta", body: "Na próxima sexta não teremos atendimento. Quem treina nesse dia pode remarcar pelo app.", authorId: MOCK_TEACHER_ID, audience: "all", pinned: true, publishedAt: isoIn(-1, 18) },
    { id: "ann_02", title: "Novo horário às terças", body: "Abrimos uma turma às 7h nas terças. Vagas limitadas — responda aqui se tiver interesse.", authorId: MOCK_TEACHER_ID, audience: "all", pinned: false, publishedAt: isoIn(-4, 12) },
    { id: "ann_03", title: "Beatriz, sua avaliação saiu", body: "Subi a avaliação física de março nos seus materiais. Bora comentar na próxima aula.", authorId: MOCK_TEACHER_ID, audience: "student", studentId: "usr_aluno", pinned: false, publishedAt: isoIn(-6, 9) },
    { id: "ann_04", title: "Recesso de fim de ano", body: "Última semana de dezembro sem aulas. Retorno no dia 6 de janeiro.", authorId: MOCK_TEACHER_ID, audience: "all", pinned: false, publishedAt: isoIn(-15, 10) },
  ];
}

export function seedDocuments(): StudyDocument[] {
  return [
    { id: "doc_01", title: "Plano de treino — Semana 12", kind: "pdf", sizeBytes: 480_000, url: "#", authorId: MOCK_TEACHER_ID, audience: "all", uploadedAt: isoIn(-1, 8) },
    { id: "doc_02", title: "Vídeo: correção de postura no agachamento", kind: "video", sizeBytes: 88_000_000, url: "#", authorId: MOCK_TEACHER_ID, audience: "all", uploadedAt: isoIn(-3, 19) },
    { id: "doc_03", title: "Ficha individual — Beatriz", kind: "sheet", sizeBytes: 22_000, url: "#", authorId: MOCK_TEACHER_ID, audience: "student", studentId: "usr_aluno", uploadedAt: isoIn(-5, 10) },
    { id: "doc_04", title: "Guia de alimentação pré-treino", kind: "doc", sizeBytes: 130_000, url: "#", authorId: MOCK_TEACHER_ID, audience: "all", uploadedAt: isoIn(-9, 14) },
    { id: "doc_05", title: "Playlist de mobilidade (YouTube)", kind: "link", sizeBytes: null, url: "https://youtube.com", authorId: MOCK_TEACHER_ID, audience: "all", uploadedAt: isoIn(-12, 9) },
    { id: "doc_06", title: "Avaliação física — Beatriz (março)", kind: "pdf", sizeBytes: 1_250_000, url: "#", authorId: MOCK_TEACHER_ID, audience: "student", studentId: "usr_aluno", uploadedAt: isoIn(-21, 11) },
  ];
}

export function seedPayments(): Payment[] {
  const billable = MOCK_STUDENTS.filter((s) => s.monthlyFeeCents > 0);

  return billable.flatMap((student, i) => {
    const previous: Payment = {
      id: `pay_${student.id}_prev`,
      studentId: student.id,
      referenceMonth: monthKey(-1),
      amountCents: student.monthlyFeeCents,
      status: "paid",
      dueDate: dueDate(student.dueDay, -1),
      paidAt: dueDate(student.dueDay, -1),
      method: (["pix", "card", "transfer", "cash"] as const)[i % 4],
    };

    const status: PaymentStatus = i % 4 === 0 ? "pending" : i % 4 === 1 ? "overdue" : "paid";
    const current: Payment = {
      id: `pay_${student.id}_curr`,
      studentId: student.id,
      referenceMonth: monthKey(0),
      amountCents: student.monthlyFeeCents,
      status,
      dueDate:
        status === "overdue" ? isoIn(-4, 12) : status === "pending" ? isoIn(3, 12) : dueDate(student.dueDay),
      paidAt: status === "paid" ? isoIn(-5) : null,
      method: status === "paid" ? "pix" : null,
    };

    return [previous, current];
  });
}
