import type { Person } from "../types";

export type PersonDetailSheetProps = {
  person: Person;
  professorNameById: Record<string, string>;
  onClose: () => void;
  onEdit: (person: Person) => void;
};
