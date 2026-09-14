"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { CalendarClock, CalendarSync, Clock4, Plus, X } from "lucide-react";
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
// Import direto dos componentes (não via index.ts) — o index também exporta helpers
// server-only (getMyRequests/getPolicy) que não podem entrar no bundle do client.
import { MyRequestsList } from "@/features/rescheduling/components/MyRequestsList";
import { RequestRescheduleSheet } from "@/features/rescheduling/components/RequestRescheduleSheet";
import { cancelLesson } from "../actions/cancel-lesson";
import { LessonFormSheet } from "./LessonFormSheet";
import type { LessonClass } from "../types";
import type { AgendaViewProps } from "./AgendaView.types";

const byStartAsc = (a: LessonClass, b: LessonClass) =>
  new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();

const isCanceled = (l: LessonClass) => /cancel/i.test(l.status);

function LessonCard({
  lesson,
  who,
  canManage,
  canRequestReschedule,
  hasPendingRequest,
  onCancel,
  onRequestReschedule,
  pending,
}: {
  lesson: LessonClass;
  who: string;
  canManage: boolean;
  canRequestReschedule: boolean;
  hasPendingRequest: boolean;
  onCancel: () => void;
  onRequestReschedule: () => void;
  pending: boolean;
}) {
  return (
    <Card className="gap-1">
      <div className="flex items-start justify-between gap-2 px-4">
        <div className="min-w-0">
          <p className="font-heading text-sm font-semibold text-foreground">{who}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(lesson.startsAt)} · {formatTime(lesson.startsAt)}–{formatTime(lesson.endsAt)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {isCanceled(lesson) ? <Badge variant="outline">Cancelada</Badge> : null}
          {hasPendingRequest ? <Badge variant="warning">Reagendamento pendente</Badge> : null}

          {canManage && !isCanceled(lesson) ? (
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
                    {who} em {formatDate(lesson.startsAt)} às {formatTime(lesson.startsAt)}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                  <AlertDialogAction onClick={onCancel}>Cancelar aula</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}

          {canRequestReschedule && !isCanceled(lesson) && !hasPendingRequest ? (
            <Button variant="ghost" size="icon-sm" aria-label="Solicitar reagendamento" onClick={onRequestReschedule}>
              <CalendarSync />
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export function AgendaView({ lessons, mode, students, studentNameById, myRequests = [] }: AgendaViewProps) {
  const [sheet, setSheet] = useState(false);
  const [rescheduleClassId, setRescheduleClassId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const canManage = mode === "manage";

  const pendingClassIds = useMemo(
    () => new Set(myRequests.filter((r) => /pend/i.test(r.status)).map((r) => r.classId)),
    [myRequests],
  );

  const { upcoming, past } = useMemo(() => {
    const now = Date.now();
    const active = lessons.filter((l) => !isCanceled(l));
    return {
      upcoming: active.filter((l) => new Date(l.startsAt).getTime() >= now).sort(byStartAsc),
      past: active
        .filter((l) => new Date(l.startsAt).getTime() < now)
        .sort((a, b) => -byStartAsc(a, b))
        .slice(0, 10),
    };
  }, [lessons]);

  const whoOf = (l: LessonClass) => (l.studentId ? studentNameById[l.studentId] ?? "Aluno" : "Aluno");

  return (
    <div className="space-y-4" data-tour="agenda-list">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Agenda</h1>
          <p className="text-sm text-muted-foreground">
            {canManage ? "Suas aulas e compromissos." : "Suas próximas aulas."}
          </p>
        </div>
        {canManage ? (
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="secondary" className="h-10" asChild data-tour="agenda-availability">
              <Link href="/disponibilidade">
                <Clock4 />
                Disponibilidade
              </Link>
            </Button>
            <Button variant="secondary" className="h-10" asChild data-tour="agenda-reagendamentos">
              <Link href="/reagendamentos">
                <CalendarSync />
                Reagendamentos
              </Link>
            </Button>
            <Button className="h-10" onClick={() => setSheet(true)} data-tour="agenda-new">
              <Plus />
              Nova aula
            </Button>
          </div>
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
                canRequestReschedule={!canManage}
                hasPendingRequest={pendingClassIds.has(lesson.id)}
                pending={pending}
                onCancel={() => startTransition(async () => void (await cancelLesson(lesson.id)))}
                onRequestReschedule={() => setRescheduleClassId(lesson.id)}
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
                canRequestReschedule={false}
                hasPendingRequest={false}
                pending={pending}
                onCancel={() => {}}
                onRequestReschedule={() => {}}
              />
            ))}
          </div>
        </section>
      ) : null}

      {!canManage ? <MyRequestsList requests={myRequests} /> : null}

      {sheet ? <LessonFormSheet students={students} onClose={() => setSheet(false)} /> : null}

      {rescheduleClassId ? (
        <RequestRescheduleSheet classId={rescheduleClassId} onClose={() => setRescheduleClassId(null)} />
      ) : null}
    </div>
  );
}
