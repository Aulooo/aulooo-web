"use client";

import { useActionState, useEffect, useState } from "react";
import { Field } from "@/shared/components/form/Field";
import { FormSheet } from "@/shared/components/form/FormSheet";
import { SelectField } from "@/shared/components/form/SelectField";
import { TextareaField } from "@/shared/components/form/TextareaField";
import { IDLE_ACTION_STATE } from "@/shared/lib/action-state";
import { saveAnnouncement } from "../actions/save-announcement";
import type { AnnouncementAudience } from "../types";
import type { AnnouncementFormSheetProps } from "./AnnouncementFormSheet.types";

export function AnnouncementFormSheet({
  announcement,
  authorId,
  students,
  onClose,
}: AnnouncementFormSheetProps) {
  const [state, formAction, pending] = useActionState(
    saveAnnouncement.bind(null, authorId),
    IDLE_ACTION_STATE,
  );
  const [audience, setAudience] = useState<AnnouncementAudience>(
    announcement?.audience ?? "all",
  );
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
      {isEdit && announcement ? (
        <input type="hidden" name="id" value={announcement.id} />
      ) : null}

      <Field
        label="Título"
        name="title"
        defaultValue={announcement?.title}
        error={state.errors?.title}
        required
      />
      <TextareaField
        label="Mensagem"
        name="body"
        rows={5}
        defaultValue={announcement?.body}
        error={state.errors?.body}
        required
      />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">Para quem</legend>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="radio"
            name="audience"
            value="all"
            checked={audience === "all"}
            onChange={() => setAudience("all")}
            className="size-4 accent-primary"
          />
          Todos os alunos
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="radio"
            name="audience"
            value="student"
            checked={audience === "student"}
            onChange={() => setAudience("student")}
            className="size-4 accent-primary"
          />
          Um aluno específico
        </label>
      </fieldset>

      {audience === "student" ? (
        <SelectField
          label="Aluno"
          name="studentId"
          options={students.map((s) => ({ value: s.id, label: s.name }))}
          defaultValue={announcement?.studentId ?? undefined}
          error={state.errors?.studentId}
          placeholder="Escolha o aluno"
        />
      ) : null}

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="pinned"
          defaultChecked={announcement?.pinned}
          className="size-4 accent-primary"
        />
        Fixar no topo
      </label>
    </FormSheet>
  );
}
