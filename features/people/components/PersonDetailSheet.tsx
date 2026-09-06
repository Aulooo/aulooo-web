"use client";

import { useTransition } from "react";
import { Pencil, Power } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { initials } from "@/shared/lib/initials";
import { formatBRL, formatFullDate } from "@/shared/lib/format";
import { ROLE_LABEL } from "@/features/shell";
import { setPersonActive } from "../actions/set-person-active";
import type { PersonDetailSheetProps } from "./PersonDetailSheet.types";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right font-medium text-foreground">{value || "—"}</span>
    </div>
  );
}

export function PersonDetailSheet({
  person,
  professorNameById,
  onClose,
  onEdit,
}: PersonDetailSheetProps) {
  const [pending, startTransition] = useTransition();
  const inactive = person.status === "inactive";

  function toggleActive() {
    startTransition(async () => {
      await setPersonActive(person.id, inactive);
      onClose();
    });
  }

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{initials(person.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <SheetTitle className="truncate">{person.name}</SheetTitle>
              <SheetDescription className="flex flex-wrap items-center gap-1.5 pt-1">
                {person.roles.map((r) => (
                  <Badge key={r} variant="secondary">
                    {ROLE_LABEL[r]}
                  </Badge>
                ))}
                {inactive ? <Badge variant="outline">Inativo</Badge> : null}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          <section>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Contato
            </h3>
            <div className="divide-y divide-border">
              <Row label="E-mail" value={person.email} />
              <Row label="Telefone" value={person.phone} />
              <Row label="CPF" value={person.document} />
              <Row
                label="Nascimento"
                value={person.birthDate ? formatFullDate(person.birthDate) : ""}
              />
            </div>
          </section>

          {person.studentProfile ? (
            <section>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Aluno
              </h3>
              <div className="divide-y divide-border">
                <Row label="Plano" value={person.studentProfile.plan} />
                <Row
                  label="Mensalidade"
                  value={formatBRL(person.studentProfile.monthlyFeeCents)}
                />
                <Row label="Vencimento" value={`Dia ${person.studentProfile.dueDay}`} />
                <Row
                  label="Professor"
                  value={
                    person.studentProfile.teacherId
                      ? professorNameById[person.studentProfile.teacherId] ?? "—"
                      : ""
                  }
                />
              </div>
            </section>
          ) : null}

          {person.teacherProfile ? (
            <section>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Professor
              </h3>
              <div className="divide-y divide-border">
                <Row label="Especialidade" value={person.teacherProfile.specialty} />
              </div>
            </section>
          ) : null}
        </div>

        <SheetFooter className="flex-row border-t border-border">
          <Button
            type="button"
            variant="secondary"
            className="h-11 flex-1"
            onClick={() => onEdit(person)}
          >
            <Pencil />
            Editar
          </Button>

          {inactive ? (
            <Button type="button" className="h-11 flex-1" disabled={pending} onClick={toggleActive}>
              <Power />
              Reativar
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" className="h-11 flex-1" disabled={pending}>
                  <Power />
                  Desativar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Desativar {person.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    A pessoa deixa de aparecer nas listas ativas e perde o acesso, mas o
                    histórico é mantido. Dá pra reativar depois.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={toggleActive}>Desativar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
