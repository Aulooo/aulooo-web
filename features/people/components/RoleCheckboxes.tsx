"use client";

import { GraduationCap, Shield, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "cn";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { ROLE_LABEL } from "@/features/shell";
import type { PersonRole } from "../types";
import type { RoleCheckboxesProps } from "./RoleCheckboxes.types";

const OPTIONS: { role: PersonRole; icon: LucideIcon; hint: string }[] = [
  { role: "aluno", icon: User, hint: "Acompanha aulas, materiais e mensalidade" },
  { role: "professor", icon: GraduationCap, hint: "Gerencia a própria carteira de alunos" },
  { role: "admin", icon: Shield, hint: "Gestão da conta e das pessoas" },
];

export function RoleCheckboxes({ value, onChange, error }: RoleCheckboxesProps) {
  function toggle(role: PersonRole, checked: boolean) {
    onChange(checked ? [...value, role] : value.filter((r) => r !== role));
  }

  return (
    <div className="space-y-2">
      {/* valores submetidos no form */}
      {value.map((role) => (
        <input key={role} type="hidden" name="roles" value={role} />
      ))}

      <div className="grid gap-2">
        {OPTIONS.map(({ role, icon: Icon, hint }) => {
          const checked = value.includes(role);
          return (
            <label
              key={role}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                checked ? "border-primary/40 bg-primary/5" : "border-border hover:bg-muted/50",
              )}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(c) => toggle(role, c === true)}
                className="mt-0.5"
              />
              <span className="min-w-0 space-y-0.5">
                <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Icon className="size-4 text-muted-foreground" aria-hidden />
                  {ROLE_LABEL[role]}
                </span>
                <span className="block text-xs text-muted-foreground">{hint}</span>
              </span>
            </label>
          );
        })}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
