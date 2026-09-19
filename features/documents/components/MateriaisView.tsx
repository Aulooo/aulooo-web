"use client";

import { useState, useTransition } from "react";
import { Archive, FileSpreadsheet, FileText, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
import { formatBytes, formatRelative } from "@/shared/lib/format";
import { deactivateDocument } from "../actions/deactivate-document";
import { DocumentFormSheet } from "./DocumentFormSheet";
import type { MateriaisViewProps } from "./MateriaisView.types";

const SHEET_EXTENSIONS = new Set(["xls", "xlsx", "csv"]);

function iconFor(extension: string): LucideIcon {
  return SHEET_EXTENSIONS.has(extension.toLowerCase()) ? FileSpreadsheet : FileText;
}

export function MateriaisView({ documents, mode, students, studentNameById }: MateriaisViewProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const canManage = mode === "manage";

  const sorted = [...documents].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime(),
  );

  return (
    <div className="space-y-4" data-tour="materiais-list">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Materiais</h1>
          <p className="text-sm text-muted-foreground">
            {canManage ? "Documentos para os seus alunos." : "Conteúdos do seu professor."}
          </p>
        </div>
        {canManage ? (
          <Button className="h-10 shrink-0" onClick={() => setOpen(true)} data-tour="materiais-new">
            <Plus />
            Novo material
          </Button>
        ) : null}
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={FileText} title="Nenhum material" description={canManage ? "Envie o primeiro arquivo." : "Quando o professor enviar, aparece aqui."} />
      ) : (
        <Card className="py-0">
          <ul className="divide-y divide-border">
            {sorted.map((doc) => {
              const Icon = iconFor(doc.extension);
              return (
                <li key={doc.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <a
                    href={`/api/materials/${doc.id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0 flex-1"
                  >
                    <p className="truncate text-sm font-medium text-foreground hover:underline">
                      {doc.originalName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(doc.size)} · {formatRelative(doc.sentAt)}
                    </p>
                  </a>
                  {canManage ? (
                    <Badge variant="secondary">{studentNameById[doc.studentId ?? ""] ?? "Aluno"}</Badge>
                  ) : null}
                  {canManage ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label="Desativar" disabled={pending}>
                          <Archive />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Desativar “{doc.originalName}”?</AlertDialogTitle>
                          <AlertDialogDescription>O aluno deixa de ver este material.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => startTransition(async () => void (await deactivateDocument(doc.id)))}
                          >
                            Desativar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {open ? <DocumentFormSheet students={students} onClose={() => setOpen(false)} /> : null}
    </div>
  );
}
