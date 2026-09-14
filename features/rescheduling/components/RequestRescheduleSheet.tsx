"use client";

import { useActionState, useEffect } from "react";
import { Field } from "@/shared/components/form/Field";
import { FormSheet } from "@/shared/components/form/FormSheet";
import { TextareaField } from "@/shared/components/form/TextareaField";
import { IDLE_ACTION_STATE } from "@/shared/lib/action-state";
import { requestReschedule } from "../actions/request-reschedule";

export function RequestRescheduleSheet({ classId, onClose }: { classId: string; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(requestReschedule, IDLE_ACTION_STATE);

  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  return (
    <FormSheet
      title="Solicitar reagendamento"
      description="Seu professor precisa aprovar antes de valer."
      submitLabel="Enviar solicitação"
      pending={pending}
      formAction={formAction}
      error={!state.ok ? state.message : undefined}
      onClose={onClose}
    >
      <input type="hidden" name="classId" value={classId} />

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Nova data" name="newDate" type="date" error={state.errors?.newDate} required />
        <Field label="Novo início" name="newStartTime" type="time" error={state.errors?.newStartTime} required />
        <Field label="Novo fim" name="newEndTime" type="time" error={state.errors?.newEndTime} required />
      </div>

      <TextareaField
        label="Motivo (opcional)"
        name="reason"
        rows={3}
        placeholder="Conte pro seu professor o motivo…"
        error={state.errors?.reason}
      />
    </FormSheet>
  );
}
