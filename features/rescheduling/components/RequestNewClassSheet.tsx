"use client";

import { useActionState, useEffect, useState } from "react";
import { Field } from "@/shared/components/form/Field";
import { FormSheet } from "@/shared/components/form/FormSheet";
import { TextareaField } from "@/shared/components/form/TextareaField";
import { IDLE_ACTION_STATE } from "@/shared/lib/action-state";
import { formatDateTime, formatTime } from "@/shared/lib/format";
import type { AvailabilitySlot } from "@/features/schedule";
import { requestNewClass } from "../actions/request-new-class";

type Picked = { date: string; start: string; end: string };

export function RequestNewClassSheet({ slots, onClose }: { slots: AvailabilitySlot[]; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(requestNewClass, IDLE_ACTION_STATE);
  const [picked, setPicked] = useState<Picked | null>(null);
  const available = slots.filter((s) => s.status === "Available").slice(0, 24);

  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  return (
    <FormSheet
      title="Solicitar aula"
      description="Seu professor precisa aprovar antes de valer."
      submitLabel="Enviar solicitação"
      pending={pending}
      formAction={formAction}
      error={!state.ok ? state.message : undefined}
      onClose={onClose}
    >
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">Horários livres do seu professor</p>
        {available.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum horário livre nos próximos dias — você ainda pode digitar uma data manualmente abaixo.
          </p>
        ) : (
          <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
            {available.map((slot) => {
              const isPicked = picked?.date === slot.date && picked.start === slot.startTime;
              return (
                <button
                  key={slot.startsAt}
                  type="button"
                  onClick={() => setPicked({ date: slot.date, start: slot.startTime, end: slot.endTime })}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    isPicked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input text-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {formatDateTime(slot.startsAt)}–{formatTime(slot.endsAt)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3" key={picked ? `${picked.date}-${picked.start}` : "manual"}>
        <Field label="Data" name="date" type="date" defaultValue={picked?.date} error={state.errors?.date} required />
        <Field
          label="Início"
          name="startTime"
          type="time"
          defaultValue={picked?.start}
          error={state.errors?.startTime}
          required
        />
        <Field
          label="Fim"
          name="endTime"
          type="time"
          defaultValue={picked?.end}
          error={state.errors?.endTime}
          required
        />
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
