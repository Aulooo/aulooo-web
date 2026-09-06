import type { Lesson } from "../types";
import type { StudentOption } from "./LessonFormSheet.types";

export type AgendaViewProps = {
  lessons: Lesson[];
  /** "manage" = professor; "read" = aluno. */
  mode: "manage" | "read";
  teacherId: string;
  students: StudentOption[];
  studentNameById: Record<string, string>;
};
