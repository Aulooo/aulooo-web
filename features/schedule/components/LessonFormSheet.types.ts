export type StudentOption = { id: string; name: string };

export type LessonFormSheetProps = {
  students: StudentOption[];
  onClose: () => void;
};
