import type { StudyDocument } from "../types";
import type { StudentOption } from "./DocumentFormSheet.types";

export type MateriaisViewProps = {
  documents: StudyDocument[];
  /** "manage" = professor; "read" = aluno. */
  mode: "manage" | "read";
  students: StudentOption[];
  studentNameById: Record<string, string>;
};
