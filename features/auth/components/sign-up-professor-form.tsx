"use client";

import { useActionState } from "react";
import { Field } from "@/shared/components/form/Field";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { IDLE_ACTION_STATE } from "@/shared/lib/action-state";
import { signUpProfessor } from "../actions/sign-up-professor";

export function SignUpProfessorForm() {
  const [state, formAction, pending] = useActionState(signUpProfessor, IDLE_ACTION_STATE);

  return (
    <Card className="w-full max-w-sm">
      <CardContent>
        <form action={formAction} className="space-y-4">
          <Field label="Nome completo" name="name" error={state.errors?.name} required />
          <Field label="CPF" name="cpf" placeholder="000.000.000-00" error={state.errors?.cpf} required />
          <Field label="E-mail" name="email" type="email" error={state.errors?.email} required />
          <Field label="Senha" name="password" type="password" error={state.errors?.password} required />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Telefone" name="phone" error={state.errors?.phone} />
            <Field label="Data de nascimento" name="dateOfBirth" type="date" error={state.errors?.dateOfBirth} />
          </div>
          <Field
            label="Registro profissional"
            name="professionalRegistration"
            placeholder="CREF-000000-G/SP"
            error={state.errors?.professionalRegistration}
            required
          />
          <Field
            label="Descrição profissional"
            name="professionalDescription"
            placeholder="Especialidade, abordagem, experiência…"
            error={state.errors?.professionalDescription}
          />

          {!state.ok && state.message ? <p className="text-sm text-destructive">{state.message}</p> : null}

          <Button type="submit" className="h-11 w-full" disabled={pending}>
            {pending ? "Criando conta…" : "Criar conta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
