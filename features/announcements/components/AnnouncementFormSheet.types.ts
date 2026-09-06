import type { Announcement } from "../types";

export type StudentOption = { id: string; name: string };

export type AnnouncementFormSheetProps = {
  announcement: Announcement | null;
  authorId: string;
  students: StudentOption[];
  onClose: () => void;
};
