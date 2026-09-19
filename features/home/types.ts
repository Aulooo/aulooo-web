import type { Announcement } from "@/features/announcements";
import type { StudyDocument } from "@/features/documents";
import type { LessonClass } from "@/features/schedule";

export type StudentHomeData = {
  firstName: string;
  nextLesson: LessonClass | null;
  announcements: Announcement[];
  documents: StudyDocument[];
};

export type ProfessorHomeData = {
  firstName: string;
  activeStudents: number;
  lessonsToday: LessonClass[];
  announcements: Announcement[];
};
