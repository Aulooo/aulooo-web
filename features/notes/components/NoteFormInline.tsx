"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { IDLE_ACTION_STATE } from "@/shared/lib/action-state";
import { saveNote } from "../actions/save-note";
import type { PrivateNote } from "../types";

export function NoteFormInline({
  studentId,
  note,
  onSaved,
  onCancel,
}: {
  studentId: string;
  note: PrivateNote | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, pending] = useActionState(saveNote, IDLE_ACTION_STATE);

  useEffect(() => {
    if (state.ok) onSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok]);

  return (
    <form action={formAction} className="space-y-2 rounded-lg border border-border p-3">
      <input type="hidden" name="studentId" value={studentId} />
      {note ? <input type="hidden" name="id" value={note.id} /> : null}

      <Textarea
        name="content"
        rows={4}
        defaultValue={note?.content}
        placeholder="Só você vê isso — não aparece pro aluno."
        autoFocus
      />
      {state.errors?.content ? <p className="text-xs text-destructive">{state.errors.content}</p> : null}
      {!state.ok && state.message ? <p className="text-xs text-destructive">{state.message}</p> : null}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Salvando…" : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
