"use client";

import { useActionState, useEffect, useState } from "react";
import { Pencil, Settings2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Field } from "@/shared/components/form/Field";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { IDLE_ACTION_STATE } from "@/shared/lib/action-state";
import { savePolicy } from "../actions/save-policy";
import type { ReschedulingPolicy } from "../types";

export function PolicyCard({ policy }: { policy: ReschedulingPolicy }) {
  const [editing, setEditing] = useState(false);
  const [selfScheduling, setSelfScheduling] = useState(policy.allowStudentSelfScheduling);
  const [state, formAction, pending] = useActionState(savePolicy, IDLE_ACTION_STATE);

  useEffect(() => {
    if (state.ok) setEditing(false);
  }, [state.ok]);

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Settings2 className="size-4 text-muted-foreground" aria-hidden />
            Política de reagendamento
          </div>
          {!editing ? (
            <Button variant="ghost" size="icon-sm" aria-label="Editar política" onClick={() => setEditing(true)}>
              <Pencil />
            </Button>
          ) : null}
        </div>

        {editing ? (
          <form action={formAction} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Antecedência mínima (horas)"
                name="minimumNoticeHours"
                inputMode="numeric"
                defaultValue={String(policy.minimumNoticeHours)}
                error={state.errors?.minimumNoticeHours}
              />
              <Field
                label="Limite mensal"
                name="monthlyLimit"
                inputMode="numeric"
                defaultValue={String(policy.monthlyLimit)}
                error={state.errors?.monthlyLimit}
              />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-md border border-input px-3 py-2.5">
              <div className="min-w-0">
                <Label htmlFor="allowStudentSelfScheduling">Aluno pode solicitar aula nova</Label>
                <p className="text-xs text-muted-foreground">
                  Além de reagendar, o aluno também pode pedir um horário do zero (você ainda aprova).
                </p>
              </div>
              <Switch
                id="allowStudentSelfScheduling"
                checked={selfScheduling}
                onCheckedChange={setSelfScheduling}
              />
              <input type="hidden" name="allowStudentSelfScheduling" value={selfScheduling ? "on" : ""} />
            </div>

            {!state.ok && state.message ? <p className="text-sm text-destructive">{state.message}</p> : null}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" disabled={pending}>
                {pending ? "Salvando…" : "Salvar"}
              </Button>
            </div>
          </form>
        ) : (
          <>
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Antecedência mínima</dt>
                <dd className="font-medium text-foreground">{policy.minimumNoticeHours} h</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Limite mensal</dt>
                <dd className="font-medium text-foreground">{policy.monthlyLimit}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Janela</dt>
                <dd className="font-medium text-foreground">{policy.windowDays} dias</dd>
              </div>
            </dl>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Aluno solicita aula nova:</span>
              <Badge variant={policy.allowStudentSelfScheduling ? "success" : "secondary"}>
                {policy.allowStudentSelfScheduling ? "Ativado" : "Desativado"}
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
