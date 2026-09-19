import { FileSpreadsheet, FileText } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { formatBytes, formatRelative } from "@/shared/lib/format";
import type { DocumentListProps } from "./DocumentList.types";

const SHEET_EXTENSIONS = new Set(["xls", "xlsx", "csv"]);

export function DocumentList({ documents }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <Card>
        <p className="px-4 text-sm text-muted-foreground">Nenhum material publicado ainda.</p>
      </Card>
    );
  }

  return (
    <Card className="py-0">
      <ul className="divide-y divide-border">
        {documents.map((doc) => {
          const Icon = SHEET_EXTENSIONS.has(doc.extension.toLowerCase()) ? FileSpreadsheet : FileText;

          return (
            <li key={doc.id}>
              <a
                href={`/api/materials/${doc.id}/download`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/60"
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
              </a>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
