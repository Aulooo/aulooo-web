export type LessonMode = "in_person" | "online";

export type LessonStatus = "scheduled" | "done" | "canceled";

export type Lesson = {
  id: string;
  title: string;
  startsAt: string;
  durationMin: number;
  mode: LessonMode;
  /** Sala física ou link da chamada. */
  location?: string | null;
  teacherId: string;
  /** null = aula em grupo/turma. */
  studentId?: string | null;
  status: LessonStatus;
  createdAt: string;
};

/** O que a Server Action recebe para agendar/editar uma aula. */
export type LessonInput = {
  title: string;
  startsAt: string;
  durationMin: number;
  mode: LessonMode;
  location?: string | null;
  studentId: string | null;
};
