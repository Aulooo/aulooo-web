import type { Announcement } from "../types";

export type RecipientOption = { id: string; name: string };

export type AnnouncementFormSheetProps = {
  announcement: Announcement | null;
  students: RecipientOption[];
  onClose: () => void;
};
