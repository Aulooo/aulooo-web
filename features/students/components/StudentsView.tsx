"use client";

import { useState, useTransition } from "react";
import { Users } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { listNotesForStudent } from "@/features/notes/actions/list-notes";
import { NotesSheet } from "@/features/notes/components/NotesSheet";
import type { PrivateNote } from "@/features/notes";
import { deactivateStudentLink } from "../actions/deactivate-student-link";
import { InviteCodeCard } from "./InviteCodeCard";
import { StudentRow } from "./StudentRow";
import type { StudentsViewProps } from "./StudentsView.types";

export function StudentsView({ students }: StudentsViewProps) {
  const [pending, startTransition] = useTransition();
  const [notesFor, setNotesFor] = useState<{ studentId: string; name: string; notes: PrivateNote[] } | null>(
    null,
  );

  function handleDeactivate(studentId: string) {
    startTransition(async () => {
      await deactivateStudentLink(studentId);
    });
  }

  function handleOpenNotes(studentId: string) {
    const student = students.find((s) => s.studentId === studentId);
    if (!student) return;
    startTransition(async () => {
      const notes = await listNotesForStudent(studentId);
      setNotesFor({ studentId, name: student.name, notes });
    });
  }

  const activeCount = students.filter((s) => !/inactive|desativad/i.test(s.linkStatus)).length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Meus alunos</h1>
        <p className="text-sm text-muted-foreground">
          {activeCount} ativo{activeCount === 1 ? "" : "s"} · {students.length} no total
        </p>
      </div>

      <InviteCodeCard />

      <div data-tour="student-list">
        {students.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum aluno vinculado"
            description="Gere um código de convite e compartilhe com o aluno."
          />
        ) : (
          <ul className="space-y-3">
            {students.map((student) => (
              <li key={student.studentId}>
                <StudentRow
                  student={student}
                  pending={pending}
                  onDeactivate={handleDeactivate}
                  onOpenNotes={handleOpenNotes}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {notesFor ? (
        <NotesSheet
          studentId={notesFor.studentId}
          studentName={notesFor.name}
          initialNotes={notesFor.notes}
          onClose={() => setNotesFor(null)}
        />
      ) : null}
    </div>
  );
}
