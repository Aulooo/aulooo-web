"use client";

import { useState, useTransition } from "react";
import { Megaphone, Pencil, Pin, Plus, Trash2 } from "lucide-react";
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
import { deleteAnnouncement } from "../actions/delete-announcement";
import { AnnouncementFormSheet } from "./AnnouncementFormSheet";
import type { Announcement } from "../types";
import type { AnnouncementsViewProps } from "./AnnouncementsView.types";

type SheetState = { kind: "closed" } | { kind: "create" } | { kind: "edit"; item: Announcement };

export function AnnouncementsView({
  announcements,
  mode,
  authorId,
  students,
  studentNameById,
}: AnnouncementsViewProps) {
  const [sheet, setSheet] = useState<SheetState>({ kind: "closed" });
  const [pending, startTransition] = useTransition();
  const canManage = mode === "manage";

  const sorted = [...announcements].sort(
    (a, b) =>
      Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) ||
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Avisos</h1>
          <p className="text-sm text-muted-foreground">
            {canManage ? "Comunicados para a turma ou alunos específicos." : "Recados do seu professor."}
          </p>
        </div>
        {canManage ? (
          <Button className="h-10 shrink-0" onClick={() => setSheet({ kind: "create" })}>
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
                  <div className="flex min-w-0 items-center gap-2">
                    {item.pinned ? <Pin className="size-4 shrink-0 text-brand-warm" aria-hidden /> : null}
                    <h2 className="truncate font-heading text-sm font-semibold text-foreground">
                      {item.title}
                    </h2>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelative(item.publishedAt)}
                  </span>
                </div>

                <p className="px-4 text-sm whitespace-pre-line text-muted-foreground">{item.body}</p>

                <div className="flex items-center justify-between gap-2 px-4">
                  <Badge variant={item.audience === "all" ? "secondary" : "default"}>
                    {item.audience === "all"
                      ? "Todos os alunos"
                      : `Para ${studentNameById[item.studentId ?? ""] ?? "aluno"}`}
                  </Badge>

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
                          <Button variant="ghost" size="icon-sm" aria-label="Apagar" disabled={pending}>
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Apagar este aviso?</AlertDialogTitle>
                            <AlertDialogDescription>
                              “{item.title}” será removido para todos. Não dá pra desfazer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                startTransition(async () => {
                                  await deleteAnnouncement(item.id);
                                })
                              }
                            >
                              Apagar
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
          authorId={authorId}
          students={students}
          onClose={() => setSheet({ kind: "closed" })}
        />
      ) : null}
    </div>
  );
}
