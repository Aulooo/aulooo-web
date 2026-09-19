"use client";

import { useActionState, useEffect } from "react";
import { Field } from "@/shared/components/form/Field";
import { FormSheet } from "@/shared/components/form/FormSheet";
import { SelectField } from "@/shared/components/form/SelectField";
import { IDLE_ACTION_STATE } from "@/shared/lib/action-state";
import { WEEKDAYS, WEEKDAY_LABEL } from "@/shared/lib/weekday";
import { saveAvailability } from "../actions/save-availability";
import type { AvailabilityFormSheetProps } from "./AvailabilityFormSheet.types";

export function AvailabilityFormSheet({ availability, onClose }: AvailabilityFormSheetProps) {
  const [state, formAction, pending] = useActionState(saveAvailability, IDLE_ACTION_STATE);
  const isEdit = Boolean(availability);

  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  return (
    <FormSheet
      title={isEdit ? "Editar disponibilidade" : "Nova disponibilidade"}
      submitLabel={isEdit ? "Salvar" : "Criar"}
      pending={pending}
      formAction={formAction}
      error={!state.ok ? state.message : undefined}
      onClose={onClose}
    >
      {isEdit && availability ? <input type="hidden" name="id" value={availability.id} /> : null}

      <SelectField
        label="Dia da semana"
        name="dayOfWeek"
        options={WEEKDAYS.map((d) => ({ value: String(d), label: WEEKDAY_LABEL[d] }))}
        defaultValue={availability ? String(availability.dayOfWeek) : undefined}
        error={state.errors?.dayOfWeek}
        placeholder="Escolha o dia"
        required
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Início"
          name="startTime"
          type="time"
          defaultValue={availability?.startTime}
          error={state.errors?.startTime}
          required
        />
        <Field
          label="Fim"
          name="endTime"
          type="time"
          defaultValue={availability?.endTime}
          error={state.errors?.endTime}
          required
        />
      </div>
    </FormSheet>
  );
}
