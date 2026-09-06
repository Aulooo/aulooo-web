"use client";

import { useState, useTransition } from "react";
import { FileText, Image as ImageIcon, Link2, Plus, Sheet, Trash2, Video } from "lucide-react";
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
import { deleteDocument } from "../actions/delete-document";
import { DocumentFormSheet } from "./DocumentFormSheet";
import type { DocumentKind } from "../types";
import type { MateriaisViewProps } from "./MateriaisView.types";

const KIND_ICON: Record<DocumentKind, LucideIcon> = {
  pdf: FileText,
  doc: FileText,
  sheet: Sheet,
  video: Video,
  image: ImageIcon,
  link: Link2,
};
const KIND_LABEL: Record<DocumentKind, string> = {
  pdf: "PDF",
  doc: "Documento",
  sheet: "Planilha",
  video: "Vídeo",
  image: "Imagem",
  link: "Link",
};

export function MateriaisView({
  documents,
  mode,
  authorId,
  students,
  studentNameById,
}: MateriaisViewProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const canManage = mode === "manage";

  const sorted = [...documents].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Materiais</h1>
          <p className="text-sm text-muted-foreground">
            {canManage ? "Documentos e conteúdos para os alunos." : "Conteúdos do seu professor."}
          </p>
        </div>
        {canManage ? (
          <Button className="h-10 shrink-0" onClick={() => setOpen(true)}>
            <Plus />
            Novo material
          </Button>
        ) : null}
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={FileText} title="Nenhum material" description={canManage ? "Publique o primeiro conteúdo." : "Quando o professor publicar, aparece aqui."} />
      ) : (
        <Card className="py-0">
          <ul className="divide-y divide-border">
            {sorted.map((doc) => {
              const Icon = KIND_ICON[doc.kind];
              const meta = doc.sizeBytes != null ? `${KIND_LABEL[doc.kind]} · ${formatBytes(doc.sizeBytes)}` : KIND_LABEL[doc.kind];
              return (
                <li key={doc.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <a href={doc.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground hover:underline">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {meta} · {formatRelative(doc.uploadedAt)}
                    </p>
                  </a>
                  <Badge variant={doc.audience === "all" ? "secondary" : "default"}>
                    {doc.audience === "all" ? "Turma" : studentNameById[doc.studentId ?? ""] ?? "Aluno"}
                  </Badge>
                  {canManage ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label="Apagar" disabled={pending}>
                          <Trash2 />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Apagar “{doc.title}”?</AlertDialogTitle>
                          <AlertDialogDescription>Os alunos deixam de ver este material.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => startTransition(async () => void (await deleteDocument(doc.id)))}>
                            Apagar
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

      {open ? (
        <DocumentFormSheet authorId={authorId} students={students} onClose={() => setOpen(false)} />
      ) : null}
    </div>
  );
}
