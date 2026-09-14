import type { StudentSummary } from "../types";

export type StudentRowProps = {
  student: StudentSummary;
  pending: boolean;
  onDeactivate: (studentId: string) => void;
  onOpenNotes: (studentId: string) => void;
};
