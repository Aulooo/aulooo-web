"use client";

import { useState } from "react";
import { FileSpreadsheet, FileText } from "lucide-react";
import { MaterialPreviewSheet } from "@/features/documents/components/MaterialPreviewSheet";
import { normalizeExtension } from "@/features/documents/lib/preview-kind";
import { Card } from "@/shared/components/ui/card";
import { formatBytes, formatRelative } from "@/shared/lib/format";
import type { DocumentListProps } from "./DocumentList.types";

const SHEET_EXTENSIONS = new Set(["xls", "xlsx", "csv"]);

export function DocumentList({ documents }: DocumentListProps) {
  const [previewing, setPreviewing] = useState<{ id: string; name: string; extension: string } | null>(null);

  if (documents.length === 0) {
    return (
      <Card>
        <p className="px-4 text-sm text-muted-foreground">Nenhum material publicado ainda.</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="py-0">
        <ul className="divide-y divide-border">
          {documents.map((doc) => {
            const Icon = SHEET_EXTENSIONS.has(normalizeExtension(doc.extension)) ? FileSpreadsheet : FileText;

            return (
              <li key={doc.id}>
                <button
                  type="button"
                  onClick={() => setPreviewing({ id: doc.id, name: doc.originalName, extension: doc.extension })}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{doc.originalName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(doc.size)} · {formatRelative(doc.sentAt)}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      {previewing ? (
        <MaterialPreviewSheet
          documentId={previewing.id}
          name={previewing.name}
          extension={previewing.extension}
          onClose={() => setPreviewing(null)}
        />
      ) : null}
    </>
  );
}
