import type { LessonClass } from "@/features/schedule";

export type LessonListProps = {
  lessons: LessonClass[];
  emptyLabel?: string;
};
