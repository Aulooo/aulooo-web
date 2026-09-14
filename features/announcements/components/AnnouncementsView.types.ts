import type { Announcement } from "../types";

export type AnnouncementsViewProps = {
  announcements: Announcement[];
  /** "manage" = professor (criar/editar/arquivar); "read" = aluno. */
  mode: "manage" | "read";
};
