"use client";

import { useActionState, useEffect, useState } from "react";
import { Field } from "@/shared/components/form/Field";
import { FormSheet } from "@/shared/components/form/FormSheet";
import { SelectField } from "@/shared/components/form/SelectField";
import { IDLE_ACTION_STATE } from "@/shared/lib/action-state";
import { saveLesson } from "../actions/save-lesson";
import type { LessonMode } from "../types";
import type { LessonFormSheetProps } from "./LessonFormSheet.types";

const DURATIONS = [30, 45, 60, 90, 120];

function isoToLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function LessonFormSheet({ lesson, teacherId, students, onClose }: LessonFormSheetProps) {
  const [state, formAction, pending] = useActionState(
    saveLesson.bind(null, teacherId),
    IDLE_ACTION_STATE,
  );
  const [mode, setMode] = useState<LessonMode>(lesson?.mode ?? "in_person");
  const isEdit = Boolean(lesson);

  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  return (
    <FormSheet
      title={isEdit ? "Editar aula" : "Nova aula"}
      submitLabel={isEdit ? "Salvar" : "Agendar"}
      pending={pending}
      formAction={formAction}
      error={!state.ok ? state.message : undefined}
      onClose={onClose}
    >
      {isEdit && lesson ? <input type="hidden" name="id" value={lesson.id} /> : null}

      <Field
        label="Título"
        name="title"
        defaultValue={lesson?.title}
        error={state.errors?.title}
        placeholder="Treino, aula, consultoria…"
        required
      />

      <SelectField
        label="Aluno"
        name="studentId"
        options={[
          { value: "turma", label: "Turma / grupo" },
          ...students.map((s) => ({ value: s.id, label: s.name })),
        ]}
        defaultValue={lesson?.studentId ?? "turma"}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Data e hora"
          name="startsAt"
          type="datetime-local"
          defaultValue={lesson ? isoToLocalInput(lesson.startsAt) : undefined}
          error={state.errors?.startsAt}
          required
        />
        <SelectField
          label="Duração"
          name="durationMin"
          options={DURATIONS.map((d) => ({ value: String(d), label: `${d} min` }))}
          defaultValue={String(lesson?.durationMin ?? 60)}
          error={state.errors?.durationMin}
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">Formato</legend>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="radio" name="mode" value="in_person" checked={mode === "in_person"} onChange={() => setMode("in_person")} className="size-4 accent-primary" />
          Presencial
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="radio" name="mode" value="online" checked={mode === "online"} onChange={() => setMode("online")} className="size-4 accent-primary" />
          Online
        </label>
      </fieldset>

      <Field
        label={mode === "online" ? "Link da chamada" : "Local / sala"}
        name="location"
        defaultValue={lesson?.location ?? ""}
        placeholder={mode === "online" ? "https://meet.google.com/…" : "Sala 2"}
      />
    </FormSheet>
  );
}
