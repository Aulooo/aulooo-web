export type LessonMode = "in_person" | "online";

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
};
