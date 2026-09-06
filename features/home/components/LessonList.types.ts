import type { Lesson } from "@/features/schedule";

export type LessonListProps = {
  lessons: Lesson[];
  emptyLabel?: string;
};
