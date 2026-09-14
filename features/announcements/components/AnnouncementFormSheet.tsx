"use client";

import { useActionState, useEffect } from "react";
import { Field } from "@/shared/components/form/Field";
import { FormSheet } from "@/shared/components/form/FormSheet";
import { TextareaField } from "@/shared/components/form/TextareaField";
import { IDLE_ACTION_STATE } from "@/shared/lib/action-state";
import { saveAnnouncement } from "../actions/save-announcement";
import type { AnnouncementFormSheetProps } from "./AnnouncementFormSheet.types";

export function AnnouncementFormSheet({ announcement, onClose }: AnnouncementFormSheetProps) {
  const [state, formAction, pending] = useActionState(saveAnnouncement, IDLE_ACTION_STATE);
  const isEdit = Boolean(announcement);

  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  return (
    <FormSheet
      title={isEdit ? "Editar aviso" : "Novo aviso"}
      submitLabel={isEdit ? "Salvar" : "Publicar"}
      pending={pending}
      formAction={formAction}
      error={!state.ok ? state.message : undefined}
      onClose={onClose}
    >
      {isEdit && announcement ? <input type="hidden" name="id" value={announcement.id} /> : null}

      <Field
        label="Título"
        name="title"
        defaultValue={announcement?.title}
        error={state.errors?.title}
        required
      />
      <TextareaField
        label="Mensagem"
        name="content"
        rows={5}
        defaultValue={announcement?.content}
        error={state.errors?.content}
        required
      />
    </FormSheet>
  );
}
