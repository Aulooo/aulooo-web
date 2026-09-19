"use client";

import { useActionState, useEffect } from "react";
import { Field } from "@/shared/components/form/Field";
import { FormSheet } from "@/shared/components/form/FormSheet";
import { RecipientPickerField } from "@/shared/components/form/RecipientPickerField";
import { IDLE_ACTION_STATE } from "@/shared/lib/action-state";
import { uploadDocument } from "../actions/upload-document";
import type { DocumentFormSheetProps } from "./DocumentFormSheet.types";

export function DocumentFormSheet({ students, onClose }: DocumentFormSheetProps) {
  const [state, formAction, pending] = useActionState(uploadDocument, IDLE_ACTION_STATE);

  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  return (
    <FormSheet
      title="Novo material"
      description="PDF, DOC, DOCX, XLS, XLSX ou CSV — até 10 MB."
      submitLabel="Enviar"
      pending={pending}
      formAction={formAction}
      error={!state.ok ? state.message : undefined}
      onClose={onClose}
    >
      <RecipientPickerField
        label="Enviar para"
        name="studentIds"
        options={students.map((s) => ({ value: s.id, label: s.name }))}
        error={state.errors?.studentIds}
      />

      <Field
        label="Arquivo"
        name="file"
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
        error={state.errors?.file}
        required
      />
    </FormSheet>
  );
}
