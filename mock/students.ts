import { isoIn } from "./_helpers";

/** Dados brutos de aluno — fonte do seed de `mock/db/people` (não é a fonte da verdade). */
type Student = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  email: string;
  phone: string;
  status: "active" | "trial" | "inactive";
  plan: string;
  monthlyFeeCents: number;
  dueDay: number;
  teacherId: string;
  joinedAt: string;
};

/** Professor dono da carteira (bate com MOCK_USERS.professor.id em ./session). */
export const MOCK_TEACHER_ID = "usr_prof";

/** O primeiro id bate com MOCK_USERS.aluno.id — é o "eu" da home do aluno. */
export const MOCK_STUDENTS: Student[] = [
  {
    id: "usr_aluno",
    name: "Beatriz Lima",
    avatarUrl: null,
    email: "bia.lima@gmail.com",
    phone: "(11) 99988-1020",
    status: "active",
    plan: "2x na semana",
    monthlyFeeCents: 32000,
    dueDay: 10,
    teacherId: MOCK_TEACHER_ID,
    joinedAt: isoIn(-236),
  },
  {
    id: "std_02",
    name: "Caio Ferreira",
    avatarUrl: null,
    email: "caio.ferreira@gmail.com",
    phone: "(11) 98812-4471",
    status: "active",
    plan: "1x na semana",
    monthlyFeeCents: 24000,
    dueDay: 5,
    teacherId: MOCK_TEACHER_ID,
    joinedAt: isoIn(-129),
  },
  {
    id: "std_03",
    name: "Marina Duarte",
    avatarUrl: null,
    email: "marina.duarte@outlook.com",
    phone: "(11) 99145-8890",
    status: "active",
    plan: "3x na semana",
    monthlyFeeCents: 42000,
    dueDay: 15,
    teacherId: MOCK_TEACHER_ID,
    joinedAt: isoIn(-402),
  },
  {
    id: "std_04",
    name: "Otávio Barros",
    avatarUrl: null,
    email: "otavio.barros@gmail.com",
    phone: "(21) 98701-2245",
    status: "trial",
    plan: "Aula experimental",
    monthlyFeeCents: 0,
    dueDay: 20,
    teacherId: MOCK_TEACHER_ID,
    joinedAt: isoIn(-6),
  },
  {
    id: "std_05",
    name: "Helena Rocha",
    avatarUrl: null,
    email: "helena.rocha@gmail.com",
    phone: "(11) 99677-1123",
    status: "active",
    plan: "2x na semana",
    monthlyFeeCents: 32000,
    dueDay: 10,
    teacherId: MOCK_TEACHER_ID,
    joinedAt: isoIn(-88),
  },
  {
    id: "std_06",
    name: "Rodrigo Santana",
    avatarUrl: null,
    email: "rodrigo.santana@gmail.com",
    phone: "(31) 98444-9087",
    status: "active",
    plan: "1x na semana",
    monthlyFeeCents: 24000,
    dueDay: 25,
    teacherId: MOCK_TEACHER_ID,
    joinedAt: isoIn(-311),
  },
  {
    id: "std_07",
    name: "Lívia Prado",
    avatarUrl: null,
    email: "livia.prado@outlook.com",
    phone: "(11) 99012-3345",
    status: "inactive",
    plan: "2x na semana",
    monthlyFeeCents: 32000,
    dueDay: 5,
    teacherId: MOCK_TEACHER_ID,
    joinedAt: isoIn(-540),
  },
  {
    id: "std_08",
    name: "Thiago Nunes",
    avatarUrl: null,
    email: "thiago.nunes@gmail.com",
    phone: "(11) 98890-5567",
    status: "active",
    plan: "3x na semana",
    monthlyFeeCents: 42000,
    dueDay: 15,
    teacherId: MOCK_TEACHER_ID,
    joinedAt: isoIn(-173),
  },
  {
    id: "std_09",
    name: "Aline Moreira",
    avatarUrl: null,
    email: "aline.moreira@gmail.com",
    phone: "(19) 99755-2210",
    status: "active",
    plan: "2x na semana",
    monthlyFeeCents: 32000,
    dueDay: 10,
    teacherId: MOCK_TEACHER_ID,
    joinedAt: isoIn(-51),
  },
];

export const MOCK_STUDENTS_BY_ID: Record<string, Student> = Object.fromEntries(
  MOCK_STUDENTS.map((s) => [s.id, s]),
);
