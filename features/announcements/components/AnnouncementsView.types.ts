import type { Announcement } from "../types";
import type { StudentOption } from "./AnnouncementFormSheet.types";

export type AnnouncementsViewProps = {
  announcements: Announcement[];
  /** "manage" = professor/admin (criar/editar/apagar); "read" = aluno. */
  mode: "manage" | "read";
  authorId: string;
  students: StudentOption[];
  studentNameById: Record<string, string>;
};
