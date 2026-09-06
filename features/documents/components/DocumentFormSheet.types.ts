export type StudentOption = { id: string; name: string };

export type DocumentFormSheetProps = {
  authorId: string;
  students: StudentOption[];
  onClose: () => void;
};
