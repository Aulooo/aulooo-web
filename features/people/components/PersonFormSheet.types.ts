import type { Person } from "../types";

export type ProfessorOption = { id: string; name: string };

export type PersonFormSheetProps = {
  /** null = criar; preenchido = editar. */
  person: Person | null;
  professors: ProfessorOption[];
  onClose: () => void;
};
