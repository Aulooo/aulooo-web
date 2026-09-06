"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { savePerson } from "../actions/save-person";
import type { PersonActionState, PersonRole } from "../types";
import { Field } from "./Field";
import { RoleCheckboxes } from "./RoleCheckboxes";
import { SelectField } from "./SelectField";
import type { PersonFormSheetProps } from "./PersonFormSheet.types";

const INITIAL: PersonActionState = { ok: false };
const DUE_DAYS = Array.from({ length: 28 }, (_, i) => String(i + 1));

function centsToInput(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function Legend({ children }: { children: React.ReactNode }) {
  return (
    <legend className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </legend>
  );
}

export function PersonFormSheet({ person, professors, onClose }: PersonFormSheetProps) {
  const [state, formAction, pending] = useActionState(savePerson, INITIAL);
  const [roles, setRoles] = useState<PersonRole[]>(person?.roles ?? []);
  const isEdit = Boolean(person);

  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  const teacherOptions = [
    { value: "none", label: "— sem professor —" },
    ...professors.map((p) => ({ value: p.id, label: p.name })),
  ];

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{isEdit ? "Editar pessoa" : "Nova pessoa"}</SheetTitle>
          <SheetDescription>
            {isEdit ? person?.name : "Cadastre alguém no Studio Alves."}
          </SheetDescription>
        </SheetHeader>

        <form action={formAction} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-6 overflow-y-auto p-4">
            {isEdit && person ? <input type="hidden" name="id" value={person.id} /> : null}

            <fieldset>
              <Legend>Dados pessoais</Legend>
              <div className="space-y-3">
                <Field label="Nome completo" name="name" defaultValue={person?.name} error={state.errors?.name} required />
                <Field label="E-mail" name="email" type="email" defaultValue={person?.email} error={state.errors?.email} required />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Telefone" name="phone" defaultValue={person?.phone} error={state.errors?.phone} placeholder="(11) 99999-0000" required />
                  <Field label="CPF" name="document" defaultValue={person?.document} error={state.errors?.document} placeholder="000.000.000-00" />
                </div>
                <Field label="Data de nascimento" name="birthDate" type="date" defaultValue={person?.birthDate} error={state.errors?.birthDate} />
              </div>
            </fieldset>

            <fieldset>
              <Legend>Perfil no Studio Alves</Legend>
              <RoleCheckboxes value={roles} onChange={setRoles} error={state.errors?.roles} />
            </fieldset>

            {roles.includes("aluno") ? (
              <fieldset>
                <Legend>Dados de aluno</Legend>
                <div className="space-y-3">
                  <Field label="Plano" name="plan" defaultValue={person?.studentProfile?.plan} error={state.errors?.["studentProfile.plan"]} placeholder="2x na semana" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="Mensalidade (R$)"
                      name="monthlyFee"
                      inputMode="decimal"
                      defaultValue={person?.studentProfile ? centsToInput(person.studentProfile.monthlyFeeCents) : ""}
                      error={state.errors?.["studentProfile.monthlyFeeCents"]}
                      placeholder="320,00"
                    />
                    <SelectField
                      label="Dia de vencimento"
                      name="dueDay"
                      options={DUE_DAYS.map((d) => ({ value: d, label: `Dia ${d}` }))}
                      defaultValue={person?.studentProfile?.dueDay ? String(person.studentProfile.dueDay) : undefined}
                      error={state.errors?.["studentProfile.dueDay"]}
                    />
                  </div>
                  <SelectField
                    label="Professor responsável"
                    name="teacherId"
                    options={teacherOptions}
                    defaultValue={person?.studentProfile?.teacherId ?? "none"}
                  />
                </div>
              </fieldset>
            ) : null}

            {roles.includes("professor") ? (
              <fieldset>
                <Legend>Dados de professor</Legend>
                <Field label="Especialidade" name="specialty" defaultValue={person?.teacherProfile?.specialty} error={state.errors?.["teacherProfile.specialty"]} placeholder="Inglês, violão, matemática…" />
              </fieldset>
            ) : null}

            {state.errors?.studentProfile ? (
              <p className="text-sm text-destructive">{state.errors.studentProfile}</p>
            ) : null}
            {state.errors?.teacherProfile ? (
              <p className="text-sm text-destructive">{state.errors.teacherProfile}</p>
            ) : null}
            {!state.ok && state.message ? (
              <p className="text-sm text-destructive">{state.message}</p>
            ) : null}
          </div>

          <SheetFooter className="flex-row border-t border-border">
            <SheetClose asChild>
              <Button type="button" variant="secondary" className="h-11 flex-1">
                Cancelar
              </Button>
            </SheetClose>
            <Button type="submit" disabled={pending} className="h-11 flex-1">
              {pending ? "Salvando…" : isEdit ? "Salvar" : "Cadastrar"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
