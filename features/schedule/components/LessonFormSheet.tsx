"use client";

import { useActionState, useEffect, useState } from "react";
import { Field } from "@/shared/components/form/Field";
import { FormSheet } from "@/shared/components/form/FormSheet";
import { SelectField } from "@/shared/components/form/SelectField";
import { IDLE_ACTION_STATE } from "@/shared/lib/action-state";
import { WEEKDAYS, WEEKDAY_LABEL } from "@/shared/lib/weekday";
import { createLesson } from "../actions/create-lesson";
import type { LessonFormSheetProps } from "./LessonFormSheet.types";

export function LessonFormSheet({ students, onClose }: LessonFormSheetProps) {
  const [state, formAction, pending] = useActionState(createLesson, IDLE_ACTION_STATE);
  const [kind, setKind] = useState<"single" | "series">("single");

  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  const studentOptions = students.map((s) => ({ value: s.id, label: s.name }));

  return (
    <FormSheet
      title="Nova aula"
      submitLabel={kind === "series" ? "Agendar série" : "Agendar"}
      pending={pending}
      formAction={formAction}
      error={!state.ok ? state.message : undefined}
      onClose={onClose}
    >
      <input type="hidden" name="kind" value={kind} />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">Repetição</legend>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="radio"
            checked={kind === "single"}
            onChange={() => setKind("single")}
            className="size-4 accent-primary"
          />
          Aula única
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="radio"
            checked={kind === "series"}
            onChange={() => setKind("series")}
            className="size-4 accent-primary"
          />
          Recorrente até uma data
        </label>
      </fieldset>

      <SelectField
        label="Aluno"
        name="studentId"
        options={studentOptions}
        error={state.errors?.studentId}
        placeholder="Escolha o aluno"
        required
      />

      {kind === "single" ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Data" name="date" type="date" error={state.errors?.date} required />
          <Field label="Início" name="startTime" type="time" error={state.errors?.startTime} required />
          <Field label="Fim" name="endTime" type="time" error={state.errors?.endTime} required />
        </div>
      ) : (
        <>
          <SelectField
            label="Dia da semana"
            name="dayOfWeek"
            options={WEEKDAYS.map((d) => ({ value: String(d), label: WEEKDAY_LABEL[d] }))}
            error={state.errors?.dayOfWeek}
            placeholder="Escolha o dia"
            required
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Início" name="startTime" type="time" error={state.errors?.startTime} required />
            <Field label="Fim" name="endTime" type="time" error={state.errors?.endTime} required />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="De" name="startDate" type="date" error={state.errors?.startDate} required />
            <Field label="Até" name="endDate" type="date" error={state.errors?.endDate} required />
          </div>
        </>
      )}
    </FormSheet>
  );
}
