"use client";

import { useMemo, useState, useTransition } from "react";
import { CalendarClock, MapPin, Pencil, Plus, Video, X } from "lucide-react";
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
import { formatDate, formatTime } from "@/shared/lib/format";
import { cancelLesson } from "../actions/cancel-lesson";
import { LessonFormSheet } from "./LessonFormSheet";
import type { Lesson } from "../types";
import type { AgendaViewProps } from "./AgendaView.types";

type SheetState = { kind: "closed" } | { kind: "create" } | { kind: "edit"; lesson: Lesson };

const byStartAsc = (a: Lesson, b: Lesson) =>
  new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();

function LessonCard({
  lesson,
  who,
  canManage,
  onEdit,
  onCancel,
  pending,
}: {
  lesson: Lesson;
  who: string;
  canManage: boolean;
  onEdit: () => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const online = lesson.mode === "online";
  return (
    <Card className="gap-1">
      <div className="flex items-start justify-between gap-2 px-4">
        <div className="min-w-0">
          <p className="font-heading text-sm font-semibold text-foreground">{lesson.title}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(lesson.startsAt)} · {formatTime(lesson.startsAt)} · {lesson.durationMin} min
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {lesson.status === "canceled" ? <Badge variant="outline">Cancelada</Badge> : null}
          {lesson.status === "done" ? <Badge variant="secondary">Realizada</Badge> : null}
          {canManage && lesson.status === "scheduled" ? (
            <>
              <Button variant="ghost" size="icon-sm" aria-label="Editar" onClick={onEdit}>
                <Pencil />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Cancelar aula" disabled={pending}>
                    <X />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancelar esta aula?</AlertDialogTitle>
                    <AlertDialogDescription>
                      “{lesson.title}” em {formatDate(lesson.startsAt)} às {formatTime(lesson.startsAt)}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                    <AlertDialogAction onClick={onCancel}>Cancelar aula</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : null}
        </div>
      </div>
      <p className="flex items-center gap-1.5 px-4 text-xs text-muted-foreground">
        {online ? <Video className="size-3.5" aria-hidden /> : <MapPin className="size-3.5" aria-hidden />}
        <span className="truncate">{online ? "Online" : lesson.location || "Presencial"}</span>
        <span aria-hidden>·</span>
        {who}
      </p>
    </Card>
  );
}

export function AgendaView({
  lessons,
  mode,
  teacherId,
  students,
  studentNameById,
}: AgendaViewProps) {
  const [sheet, setSheet] = useState<SheetState>({ kind: "closed" });
  const [pending, startTransition] = useTransition();
  const canManage = mode === "manage";

  const { upcoming, past } = useMemo(() => {
    const now = Date.now();
    const active = lessons.filter((l) => l.status !== "canceled");
    return {
      upcoming: active.filter((l) => new Date(l.startsAt).getTime() >= now).sort(byStartAsc),
      past: active
        .filter((l) => new Date(l.startsAt).getTime() < now)
        .sort((a, b) => -byStartAsc(a, b))
        .slice(0, 10),
    };
  }, [lessons]);

  const whoOf = (l: Lesson) =>
    l.studentId ? studentNameById[l.studentId] ?? "Aluno" : "Turma";

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Agenda</h1>
          <p className="text-sm text-muted-foreground">
            {canManage ? "Suas aulas e compromissos." : "Suas próximas aulas."}
          </p>
        </div>
        {canManage ? (
          <Button className="h-10 shrink-0" onClick={() => setSheet({ kind: "create" })}>
            <Plus />
            Nova aula
          </Button>
        ) : null}
      </div>

      {upcoming.length === 0 && past.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="Nada na agenda"
          description={canManage ? "Agende a primeira aula." : "Quando o professor marcar, aparece aqui."}
        />
      ) : null}

      {upcoming.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Próximas</h2>
          <div className="space-y-3">
            {upcoming.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                who={whoOf(lesson)}
                canManage={canManage}
                pending={pending}
                onEdit={() => setSheet({ kind: "edit", lesson })}
                onCancel={() => startTransition(async () => void (await cancelLesson(lesson.id)))}
              />
            ))}
          </div>
        </section>
      ) : null}

      {past.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Anteriores</h2>
          <div className="space-y-3 opacity-75">
            {past.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                who={whoOf(lesson)}
                canManage={false}
                pending={pending}
                onEdit={() => {}}
                onCancel={() => {}}
              />
            ))}
          </div>
        </section>
      ) : null}

      {sheet.kind !== "closed" ? (
        <LessonFormSheet
          lesson={sheet.kind === "edit" ? sheet.lesson : null}
          teacherId={teacherId}
          students={students}
          onClose={() => setSheet({ kind: "closed" })}
        />
      ) : null}
    </div>
  );
}
