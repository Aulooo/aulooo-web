"use client";

import { useState, useTransition } from "react";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/EmptyState";
import { initials } from "@/shared/lib/initials";
import { statusLabel } from "@/shared/lib/status-label";
import { generateStudentEntryCodeForProfessor } from "../actions/generate-student-entry-code";
import type { AdminProfessorSummary } from "../types";
import type { ProfessorsListProps } from "./ProfessorsList.types";

export function ProfessorsList({ professors }: ProfessorsListProps) {
  if (professors.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Nenhum professor cadastrado"
        description="Gere um convite de professor pra começar."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {professors.map((professor) => (
        <li key={professor.professorId}>
          <ProfessorRow professor={professor} />
        </li>
      ))}
    </ul>
  );
}

function ProfessorRow({ professor }: { professor: AdminProfessorSummary }) {
  const [pending, startTransition] = useTransition();
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleGenerate() {
    startTransition(async () => {
      setError(null);
      const result = await generateStudentEntryCodeForProfessor(professor.professorId);
      if (result.ok && result.code) setCode(result.code);
      else setError(result.message ?? "Não foi possível gerar o código.");
    });
  }

  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback>{initials(professor.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{professor.name}</p>
            <p className="truncate text-xs text-muted-foreground">{professor.professionalRegistration}</p>
          </div>
          <Badge variant={professor.status === "Active" ? "success" : "secondary"}>
            {statusLabel(professor.status)}
          </Badge>
          <Button variant="secondary" size="sm" onClick={handleGenerate} disabled={pending}>
            Código de aluno
          </Button>
        </div>
        {code ? (
          <p className="rounded-md bg-muted px-3 py-2 font-heading text-sm font-semibold tracking-widest text-foreground">
            {code}
          </p>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
