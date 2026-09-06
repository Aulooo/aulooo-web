import type { Lesson } from "../types";

export type StudentOption = { id: string; name: string };

export type LessonFormSheetProps = {
  lesson: Lesson | null;
  teacherId: string;
  students: StudentOption[];
  onClose: () => void;
};
