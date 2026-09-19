export type StudentOption = { id: string; name: string };

export type DocumentFormSheetProps = {
  students: StudentOption[];
  onClose: () => void;
};
