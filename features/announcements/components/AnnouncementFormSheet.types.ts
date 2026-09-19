import type { Announcement } from "../types";

export type AnnouncementFormSheetProps = {
  announcement: Announcement | null;
  onClose: () => void;
};
