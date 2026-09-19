"use client";

import { useState, useTransition } from "react";
import { Archive, Pencil, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";
import { formatRelative } from "@/shared/lib/format";
import { archiveNote } from "../actions/archive-note";
import { listNotesForStudent } from "../actions/list-notes";
import { NoteFormInline } from "./NoteFormInline";
import type { PrivateNote } from "../types";

export function NotesSheet({
  studentId,
  studentName,
  initialNotes,
  onClose,
}: {
  studentId: string;
  studentName: string;
  initialNotes: PrivateNote[];
  onClose: () => void;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [formState, setFormState] = useState<{ kind: "closed" } | { kind: "create" } | { kind: "edit"; note: PrivateNote }>({
    kind: "closed",
  });
  const [pending, startTransition] = useTransition();

  function refresh() {
    startTransition(async () => {
      setNotes(await listNotesForStudent(studentId));
      setFormState({ kind: "closed" });
    });
  }

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border">
          <SheetTitle>Observações — {studentName}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {formState.kind !== "closed" ? (
            <NoteFormInline
              studentId={studentId}
              note={formState.kind === "edit" ? formState.note : null}
              onSaved={refresh}
              onCancel={() => setFormState({ kind: "closed" })}
            />
          ) : (
            <Button variant="secondary" className="w-full" onClick={() => setFormState({ kind: "create" })}>
              <Plus />
              Nova observação
            </Button>
          )}

          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma observação ainda.</p>
          ) : (
            <ul className="space-y-2">
              {notes.map((note) => (
                <li key={note.id}>
                  <Card>
                    <CardContent className="space-y-2">
                      <p className="whitespace-pre-line text-sm text-foreground">{note.content}</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-muted-foreground">{formatRelative(note.updatedAt)}</p>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Editar"
                            disabled={pending}
                            onClick={() => setFormState({ kind: "edit", note })}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Arquivar"
                            disabled={pending}
                            onClick={() => startTransition(async () => { await archiveNote(note.id); refresh(); })}
                          >
                            <Archive />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
