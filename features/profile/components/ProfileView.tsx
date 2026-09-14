"use client";

import { useActionState, useEffect, useState } from "react";
import { Compass, Moon, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Field } from "@/shared/components/form/Field";
import { FormSheet } from "@/shared/components/form/FormSheet";
import { IDLE_ACTION_STATE } from "@/shared/lib/action-state";
import { initials } from "@/shared/lib/initials";
import { ROLE_LABEL, ThemeToggle } from "@/features/shell";
import { InviteCodeCard } from "@/features/students/components/InviteCodeCard";
import { restartTour } from "@/features/tour";
import { updateProfile } from "../actions/update-profile";
import { AvatarUploadButton } from "./AvatarUploadButton";
import { BrandingCard } from "./BrandingCard";
import type { ProfileViewProps } from "./ProfileView.types";

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value || "—"}</span>
    </div>
  );
}

export function ProfileView({ profile, branding }: ProfileViewProps) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateProfile.bind(null, profile.role, profile.email),
    IDLE_ACTION_STATE,
  );
  const isProfessor = profile.role === "professor";
  const userId = profile.role === "professor" ? profile.professorId : profile.studentId;

  useEffect(() => {
    if (state.ok) setEditing(false);
  }, [state.ok]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl font-semibold text-foreground">Perfil</h1>
        <Button
          variant="secondary"
          className="h-10 shrink-0"
          onClick={() => setEditing(true)}
          data-tour="profile-edit"
        >
          <Pencil />
          Editar
        </Button>
      </div>

      <Card>
        <CardContent className="flex items-center gap-3">
          <div className="relative shrink-0">
            <Avatar size="lg">
              {profile.hasAvatar ? <AvatarImage src="/api/avatar" alt={profile.name} /> : null}
              <AvatarFallback>{initials(profile.name)}</AvatarFallback>
            </Avatar>
            <AvatarUploadButton />
          </div>
          <div className="min-w-0">
            <p className="font-heading text-base font-semibold text-foreground">{profile.name}</p>
            <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              <Badge variant="secondary">{ROLE_LABEL[profile.role]}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="divide-y divide-border">
          <Row label="Telefone" value={profile.phone} />
          <Row label="CPF" value={profile.cpf} />
          {isProfessor ? (
            <Row label="Registro profissional" value={profile.professionalRegistration} />
          ) : (
            <Row label="Objetivo" value={profile.objective} />
          )}
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

      <Card>
        <CardContent className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Compass className="size-4 text-muted-foreground" aria-hidden />
            Tour guiado
          </div>
          <Button variant="secondary" size="sm" onClick={() => restartTour(profile.role, userId)}>
            Rever
          </Button>
        </CardContent>
      </Card>

      {isProfessor && branding ? <BrandingCard branding={branding} /> : null}

      {isProfessor ? <InviteCodeCard /> : null}

      {editing ? (
        <FormSheet
          title="Editar perfil"
          submitLabel="Salvar"
          pending={pending}
          formAction={formAction}
          error={!state.ok ? state.message : undefined}
          onClose={() => setEditing(false)}
        >
          <Field label="Nome completo" name="name" defaultValue={profile.name} error={state.errors?.name} required />
          <Field label="E-mail" name="email" type="email" defaultValue={profile.email} error={state.errors?.email} required />
          <Field label="Telefone" name="phone" defaultValue={profile.phone ?? ""} error={state.errors?.phone} />
          <Field
            label="Data de nascimento"
            name="dateOfBirth"
            type="date"
            defaultValue={profile.dateOfBirth ?? ""}
            error={state.errors?.dateOfBirth}
          />
          {isProfessor ? (
            <>
              <Field
                label="Registro profissional"
                name="professionalRegistration"
                defaultValue={profile.professionalRegistration}
                error={state.errors?.professionalRegistration}
                required
              />
              <Field
                label="Descrição profissional"
                name="professionalDescription"
                defaultValue={profile.professionalDescription ?? ""}
                error={state.errors?.professionalDescription}
                placeholder="Especialidade, abordagem, experiência…"
              />
            </>
          ) : (
            <Field
              label="Objetivo"
              name="objective"
              defaultValue={profile.objective ?? ""}
              error={state.errors?.objective}
              placeholder="Emagrecimento, condicionamento, hipertrofia…"
            />
          )}
        </FormSheet>
      ) : null}
    </div>
  );
}
