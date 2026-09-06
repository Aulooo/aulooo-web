"use client";

import { useActionState, useEffect, useState } from "react";
import { Field } from "@/shared/components/form/Field";
import { FormSheet } from "@/shared/components/form/FormSheet";
import { SelectField } from "@/shared/components/form/SelectField";
import { IDLE_ACTION_STATE } from "@/shared/lib/action-state";
import { saveDocument } from "../actions/save-document";
import type { DocumentAudience } from "../types";
import type { DocumentFormSheetProps } from "./DocumentFormSheet.types";

const KINDS = [
  { value: "link", label: "Link" },
  { value: "pdf", label: "PDF" },
  { value: "doc", label: "Documento" },
  { value: "sheet", label: "Planilha" },
  { value: "video", label: "Vídeo" },
  { value: "image", label: "Imagem" },
];

export function DocumentFormSheet({ authorId, students, onClose }: DocumentFormSheetProps) {
  const [state, formAction, pending] = useActionState(
    saveDocument.bind(null, authorId),
    IDLE_ACTION_STATE,
  );
  const [audience, setAudience] = useState<DocumentAudience>("all");

  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  return (
    <FormSheet
      title="Novo material"
      description="No mock, cole um link — o upload de arquivo entra com o backend."
      submitLabel="Publicar"
      pending={pending}
      formAction={formAction}
      error={!state.ok ? state.message : undefined}
      onClose={onClose}
    >
      <Field label="Título" name="title" error={state.errors?.title} required />
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectField label="Tipo" name="kind" options={KINDS} defaultValue="link" error={state.errors?.kind} />
        <Field label="Link" name="url" placeholder="https://…" error={state.errors?.url} required />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">Para quem</legend>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="radio" name="audience" value="all" checked={audience === "all"} onChange={() => setAudience("all")} className="size-4 accent-primary" />
          Todos os alunos
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="radio" name="audience" value="student" checked={audience === "student"} onChange={() => setAudience("student")} className="size-4 accent-primary" />
          Um aluno específico
        </label>
      </fieldset>

      {audience === "student" ? (
        <SelectField
          label="Aluno"
          name="studentId"
          options={students.map((s) => ({ value: s.id, label: s.name }))}
          error={state.errors?.studentId}
          placeholder="Escolha o aluno"
        />
      ) : null}
    </FormSheet>
  );
}
