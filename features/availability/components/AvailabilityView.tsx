"use client";

import { useState, useTransition } from "react";
import { CalendarClock, Pencil, Plus, X } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
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
import { EmptyState } from "@/shared/components/EmptyState";
import { WEEKDAY_LABEL } from "@/shared/lib/weekday";
import { deactivateAvailability } from "../actions/deactivate-availability";
import { AvailabilityFormSheet } from "./AvailabilityFormSheet";
import type { Availability } from "../types";
import type { AvailabilityViewProps } from "./AvailabilityView.types";

type SheetState = { kind: "closed" } | { kind: "create" } | { kind: "edit"; item: Availability };

const isActive = (a: Availability) => !/inactive|inativ/i.test(a.status);

export function AvailabilityView({ availabilities }: AvailabilityViewProps) {
  const [sheet, setSheet] = useState<SheetState>({ kind: "closed" });
  const [pending, startTransition] = useTransition();

  const sorted = [...availabilities].sort(
    (a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Disponibilidade</h1>
          <p className="text-sm text-muted-foreground">Horários em que você aceita agendar aulas.</p>
        </div>
        <Button className="h-10 shrink-0" onClick={() => setSheet({ kind: "create" })}>
          <Plus />
          Nova
        </Button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="Nenhuma disponibilidade"
          description="Sem isso, não dá pra criar aula nem série — cadastre pelo menos um horário."
        />
      ) : (
        <ul className="space-y-3">
          {sorted.map((item) => (
            <li key={item.id}>
              <Card>
                <CardContent className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{WEEKDAY_LABEL[item.dayOfWeek]}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.startTime}–{item.endTime}
                    </p>
                  </div>

                  {!isActive(item) ? <Badge variant="secondary">Inativa</Badge> : null}

                  {isActive(item) ? (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Editar"
                        onClick={() => setSheet({ kind: "edit", item })}
                      >
                        <Pencil />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon-sm" aria-label="Desativar" disabled={pending}>
                            <X />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Desativar esta disponibilidade?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {WEEKDAY_LABEL[item.dayOfWeek]} · {item.startTime}–{item.endTime}. Aulas já
                              agendadas nesse horário não são canceladas.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                startTransition(async () => void (await deactivateAvailability(item.id)))
                              }
                            >
                              Desativar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {sheet.kind !== "closed" ? (
        <AvailabilityFormSheet
          availability={sheet.kind === "edit" ? sheet.item : null}
          onClose={() => setSheet({ kind: "closed" })}
        />
      ) : null}
    </div>
  );
}
