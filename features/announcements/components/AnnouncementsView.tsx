"use client";

import { useMemo, useState, useTransition } from "react";
import { Archive, Megaphone, Pencil, Plus } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
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
import { formatRelative } from "@/shared/lib/format";
import { archiveAnnouncement } from "../actions/archive-announcement";
import { AnnouncementFormSheet } from "./AnnouncementFormSheet";
import type { Announcement } from "../types";
import type { AnnouncementsViewProps } from "./AnnouncementsView.types";

type SheetState = { kind: "closed" } | { kind: "create" } | { kind: "edit"; item: Announcement };

export function AnnouncementsView({ announcements, mode, students }: AnnouncementsViewProps) {
  const [sheet, setSheet] = useState<SheetState>({ kind: "closed" });
  const [pending, startTransition] = useTransition();
  const canManage = mode === "manage";

  const studentNameById = useMemo(
    () => Object.fromEntries(students.map((s) => [s.id, s.name])),
    [students],
  );

  const sorted = [...announcements].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  function audienceLabel(item: Announcement) {
    if (item.audience !== "Specific" || item.recipientStudentIds.length === 0) return "Todos os alunos";
    if (item.recipientStudentIds.length === 1) {
      return studentNameById[item.recipientStudentIds[0]] ?? "1 aluno";
    }
    return `${item.recipientStudentIds.length} alunos`;
  }

  return (
    <div className="space-y-4" data-tour="avisos-list">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Avisos</h1>
          <p className="text-sm text-muted-foreground">
            {canManage ? "Comunicados para a turma inteira." : "Recados do seu professor."}
          </p>
        </div>
        {canManage ? (
          <Button className="h-10 shrink-0" onClick={() => setSheet({ kind: "create" })} data-tour="avisos-new">
            <Plus />
            Novo aviso
          </Button>
        ) : null}
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={Megaphone} title="Nenhum aviso" description={canManage ? "Publique o primeiro comunicado." : "Quando houver recado novo, aparece aqui."} />
      ) : (
        <ul className="space-y-3">
          {sorted.map((item) => (
            <li key={item.id}>
              <Card className="gap-2">
                <div className="flex items-start justify-between gap-2 px-4">
                  <h2 className="min-w-0 truncate font-heading text-sm font-semibold text-foreground">
                    {item.title}
                  </h2>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelative(item.publishedAt)}
                  </span>
                </div>

                <p className="px-4 text-sm whitespace-pre-line text-muted-foreground">{item.content}</p>

                <div className="flex items-center justify-between gap-2 px-4">
                  {canManage ? <Badge variant="secondary">{audienceLabel(item)}</Badge> : <span />}
                  {canManage ? (
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
                          <Button variant="ghost" size="icon-sm" aria-label="Arquivar" disabled={pending}>
                            <Archive />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Arquivar este aviso?</AlertDialogTitle>
                            <AlertDialogDescription>
                              “{item.title}” deixa de aparecer para os alunos. O histórico continua disponível
                              pra você.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                startTransition(async () => {
                                  await archiveAnnouncement(item.id);
                                })
                              }
                            >
                              Arquivar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ) : null}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {sheet.kind !== "closed" ? (
        <AnnouncementFormSheet
          announcement={sheet.kind === "edit" ? sheet.item : null}
          students={students}
          onClose={() => setSheet({ kind: "closed" })}
        />
      ) : null}
    </div>
  );
}
