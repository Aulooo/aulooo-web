import type { ReschedulingRequestItem } from "@/features/rescheduling";
import type { AvailabilitySlot, LessonClass } from "../types";
import type { StudentOption } from "./LessonFormSheet.types";

export type AgendaViewProps = {
  lessons: LessonClass[];
  /** "manage" = professor; "read" = aluno. */
  mode: "manage" | "read";
  students: StudentOption[];
  studentNameById: Record<string, string>;
  /** Só no modo "read" — pra saber se uma aula já tem pedido de reagendamento pendente. */
  myRequests?: ReschedulingRequestItem[];
  /** Só no modo "read" — o professor habilitou pedido de aula nova? Default false. */
  allowSelfScheduling?: boolean;
  /** Só no modo "read", quando allowSelfScheduling — horários livres pro seletor. */
  slots?: AvailabilitySlot[];
};
