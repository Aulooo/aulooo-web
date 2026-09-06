import { FileText, ImageIcon, Link2, Sheet, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { formatBytes, formatRelative } from "@/shared/lib/format";
import type { DocumentKind } from "@/features/documents";
import type { DocumentListProps } from "./DocumentList.types";

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
          const Icon = KIND_ICON[doc.kind];
          const meta =
            doc.sizeBytes != null
              ? `${KIND_LABEL[doc.kind]} · ${formatBytes(doc.sizeBytes)}`
              : KIND_LABEL[doc.kind];

          return (
            <li key={doc.id}>
              <a href={doc.url} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/60">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {meta} · {formatRelative(doc.uploadedAt)}
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
