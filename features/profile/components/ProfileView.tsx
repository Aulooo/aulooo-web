"use client";

import { useActionState, useEffect, useState } from "react";
import { Moon, Pencil } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Field } from "@/shared/components/form/Field";
import { FormSheet } from "@/shared/components/form/FormSheet";
import { IDLE_ACTION_STATE } from "@/shared/lib/action-state";
import { initials } from "@/shared/lib/initials";
import { ROLE_LABEL, ThemeToggle } from "@/features/shell";
import { updateProfile } from "../actions/update-profile";
import type { ProfileViewProps } from "./ProfileView.types";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value || "—"}</span>
    </div>
  );
}

export function ProfileView({ person }: ProfileViewProps) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateProfile.bind(null, person.id),
    IDLE_ACTION_STATE,
  );
  const isTeacher = person.roles.includes("professor");

  useEffect(() => {
    if (state.ok) setEditing(false);
  }, [state.ok]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl font-semibold text-foreground">Perfil</h1>
        <Button variant="secondary" className="h-10 shrink-0" onClick={() => setEditing(true)}>
          <Pencil />
          Editar
        </Button>
      </div>

      <Card>
        <CardContent className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>{initials(person.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-heading text-base font-semibold text-foreground">{person.name}</p>
            <p className="truncate text-sm text-muted-foreground">{person.email}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {person.roles.map((r) => (
                <Badge key={r} variant="secondary">
                  {ROLE_LABEL[r]}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="divide-y divide-border">
          <Row label="Telefone" value={person.phone} />
          <Row label="CPF" value={person.document} />
          {isTeacher ? <Row label="Especialidade" value={person.teacherProfile?.specialty ?? ""} /> : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Moon className="size-4 text-muted-foreground" aria-hidden />
            Tema escuro
          </div>
          <ThemeToggle />
        </CardContent>
      </Card>

      {editing ? (
        <FormSheet
          title="Editar perfil"
          submitLabel="Salvar"
          pending={pending}
          formAction={formAction}
          error={!state.ok ? state.message : undefined}
          onClose={() => setEditing(false)}
        >
          <Field label="Nome completo" name="name" defaultValue={person.name} error={state.errors?.name} required />
          <Field label="Telefone" name="phone" defaultValue={person.phone} error={state.errors?.phone} required />
          {isTeacher ? (
            <Field
              label="Especialidade"
              name="specialty"
              defaultValue={person.teacherProfile?.specialty ?? ""}
              error={state.errors?.specialty}
              placeholder="Inglês, violão, matemática…"
            />
          ) : (
            <input type="hidden" name="specialty" value="" />
          )}
        </FormSheet>
      ) : null}
    </div>
  );
}
