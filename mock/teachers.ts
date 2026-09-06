import type { Teacher } from "@/features/teachers";
import { isoIn } from "./_helpers";
import { MOCK_STUDENTS, MOCK_TEACHER_ID } from "./students";

/** Para a visão do administrador. Rafael bate com MOCK_USERS.professor. */
export const MOCK_TEACHERS: Teacher[] = [
  {
    id: MOCK_TEACHER_ID,
    name: "Rafael Nunes",
    avatarUrl: null,
    email: "rafael@studioalves.com.br",
    status: "active",
    studentCount: MOCK_STUDENTS.filter((s) => s.status !== "inactive").length,
    joinedAt: isoIn(-720),
  },
  {
    id: "tch_02",
    name: "Juliana Castro",
    avatarUrl: null,
    email: "juliana@studioalves.com.br",
    status: "active",
    studentCount: 14,
    joinedAt: isoIn(-540),
  },
  {
    id: "tch_03",
    name: "Pedro Alcântara",
    avatarUrl: null,
    email: "pedro@studioalves.com.br",
    status: "active",
    studentCount: 9,
    joinedAt: isoIn(-190),
  },
  {
    id: "tch_04",
    name: "Sofia Ramires",
    avatarUrl: null,
    email: "sofia@studioalves.com.br",
    status: "inactive",
    studentCount: 0,
    joinedAt: isoIn(-95),
  },
];
