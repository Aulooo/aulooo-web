import type { ReschedulingRequestItem } from "@/features/rescheduling";
import type { LessonClass } from "../types";
import type { StudentOption } from "./LessonFormSheet.types";

export type AgendaViewProps = {
  lessons: LessonClass[];
  /** "manage" = professor; "read" = aluno. */
  mode: "manage" | "read";
  students: StudentOption[];
  studentNameById: Record<string, string>;
  /** Só no modo "read" — pra saber se uma aula já tem pedido de reagendamento pendente. */
  myRequests?: ReschedulingRequestItem[];
};
