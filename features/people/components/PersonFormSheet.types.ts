import type { Person } from "../types";

export type ProfessorOption = { id: string; name: string };

export type PersonFormSheetProps = {
  /** null = criar; preenchido = editar. */
  person: Person | null;
  professors: ProfessorOption[];
  /** Trava o papel em "aluno" e esconde o seletor de papéis (contexto do professor). */
  lockRoleAluno?: boolean;
  /** Fixa o professor responsável e esconde o seletor (contexto do professor). */
  fixedTeacherId?: string;
  onClose: () => void;
};
