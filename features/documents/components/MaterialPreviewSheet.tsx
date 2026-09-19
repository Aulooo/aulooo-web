"use client";

import { useEffect, useState } from "react";
import { Download, FileWarning, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";
import { materialDownloadUrl } from "../lib/material-url";
import { parseCsv } from "../lib/parse-csv";
import { previewKindFor } from "../lib/preview-kind";

type PreviewState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "unsupported" }
  | { status: "pdf"; url: string }
  | { status: "image"; url: string }
  | { status: "html"; html: string }
  | { status: "table"; rows: string[][] };

export function MaterialPreviewSheet({
  documentId,
  name,
  extension,
  onClose,
}: {
  documentId: string;
  name: string;
  extension: string;
  onClose: () => void;
}) {
  const [state, setState] = useState<PreviewState>({ status: "loading" });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    const kind = previewKindFor(extension);

    async function load() {
      if (kind === "unsupported") {
        setState({ status: "unsupported" });
        return;
      }
      try {
        const res = await fetch(materialDownloadUrl(documentId));
        if (!res.ok) throw new Error("download failed");
        const blob = await res.blob();
        if (cancelled) return;

        if (kind === "pdf" || kind === "image") {
          objectUrl = URL.createObjectURL(blob);
          setState({ status: kind, url: objectUrl });
          return;
        }
        if (kind === "docx") {
          const mammoth = await import("mammoth");
          const arrayBuffer = await blob.arrayBuffer();
          const { value } = await mammoth.convertToHtml({ arrayBuffer });
          if (!cancelled) setState({ status: "html", html: value });
          return;
        }
        if (kind === "csv") {
          const text = await blob.text();
          if (!cancelled) setState({ status: "table", rows: parseCsv(text) });
        }
      } catch {
        if (!cancelled) setState({ status: "error" });
      }
    }

    void load();
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [documentId, extension]);

  return (
    <Sheet open onOpenChange={(next) => !next && onClose()}>
      <SheetContent
        side="right"
        className={
          expanded
            ? "w-full gap-0 data-[side=right]:sm:max-w-full"
            : "w-full gap-0 data-[side=right]:sm:max-w-3xl"
        }
      >
        <SheetHeader className="border-b border-border">
          <div className="flex items-center justify-between gap-2 pr-8">
            <SheetTitle className="truncate">{name}</SheetTitle>
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              onClick={() => setExpanded((e) => !e)}
              aria-label={expanded ? "Reduzir" : "Expandir"}
            >
              {expanded ? <Minimize2 /> : <Maximize2 />}
            </Button>
          </div>
          <SheetDescription>Visualização do material.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto p-4">
          {state.status === "loading" ? (
            <div className="flex h-full min-h-[50vh] items-center justify-center text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : null}

          {state.status === "error" ? (
            <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <FileWarning className="size-8" />
              <p className="text-sm">Não foi possível carregar a prévia.</p>
              <Button asChild variant="secondary">
                <a href={materialDownloadUrl(documentId)} download>
                  <Download />
                  Baixar arquivo
                </a>
              </Button>
            </div>
          ) : null}

          {state.status === "unsupported" ? (
            <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <FileWarning className="size-8" />
              <p className="text-sm">Este formato não tem prévia — baixe para visualizar.</p>
              <Button asChild>
                <a href={materialDownloadUrl(documentId)} download>
                  <Download />
                  Baixar arquivo
                </a>
              </Button>
            </div>
          ) : null}

          {state.status === "pdf" ? (
            <iframe
              src={state.url}
              title={name}
              className="h-full min-h-[75vh] w-full rounded-md border border-border"
            />
          ) : null}

          {state.status === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element -- blob: URL local, next/image não aceita.
            <img src={state.url} alt={name} className="mx-auto max-h-[75vh] max-w-full rounded-md object-contain" />
          ) : null}

          {state.status === "html" ? (
            <div
              className="max-w-none text-sm leading-relaxed text-foreground [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mt-3 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-2 [&_strong]:font-semibold [&_table]:my-2 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1"
              // eslint-disable-next-line react/no-danger -- HTML gerado pelo mammoth a partir do .docx do próprio professor.
              dangerouslySetInnerHTML={{ __html: state.html }}
            />
          ) : null}

          {state.status === "table" ? (
            <div className="overflow-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {state.rows.map((row, i) => (
                    <tr key={i} className={i === 0 ? "bg-muted font-medium" : "odd:bg-muted/30"}>
                      {row.map((cell, j) => (
                        <td key={j} className="border-b border-border px-3 py-1.5 whitespace-nowrap">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
