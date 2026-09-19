import type { ReactNode } from "react";

export type FormSheetProps = {
  title: string;
  description?: ReactNode;
  submitLabel: string;
  pending: boolean;
  formAction: (formData: FormData) => void;
  /** Mensagem de erro geral (não ligada a um campo). */
  error?: string;
  onClose: () => void;
  children: ReactNode;
};
