import type { Announcement } from "@/features/announcements";
import { isoIn } from "./_helpers";
import { MOCK_TEACHER_ID } from "./students";

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann_01",
    title: "Feriado: sem aulas na sexta",
    body: "Na próxima sexta não teremos atendimento. Quem treina nesse dia pode remarcar pelo app.",
    authorId: MOCK_TEACHER_ID,
    audience: "all",
    pinned: true,
    publishedAt: isoIn(-1, 18),
  },
  {
    id: "ann_02",
    title: "Novo horário às terças",
    body: "Abrimos uma turma às 7h nas terças. Vagas limitadas — responda aqui se tiver interesse.",
    authorId: MOCK_TEACHER_ID,
    audience: "all",
    publishedAt: isoIn(-4, 12),
  },
  {
    id: "ann_03",
    title: "Beatriz, sua avaliação saiu",
    body: "Subi a avaliação física de março nos seus materiais. Bora comentar na próxima aula.",
    authorId: MOCK_TEACHER_ID,
    audience: "student",
    studentId: "usr_aluno",
    publishedAt: isoIn(-6, 9),
  },
  {
    id: "ann_04",
    title: "Recesso de fim de ano",
    body: "Última semana de dezembro sem aulas. Retorno no dia 6 de janeiro.",
    authorId: MOCK_TEACHER_ID,
    audience: "all",
    publishedAt: isoIn(-15, 10),
  },
];
