import type { StudyDocument } from "../types";
import type { StudentOption } from "./DocumentFormSheet.types";

export type MateriaisViewProps = {
  documents: StudyDocument[];
  /** "manage" = professor/admin; "read" = aluno. */
  mode: "manage" | "read";
  authorId: string;
  students: StudentOption[];
  studentNameById: Record<string, string>;
};
