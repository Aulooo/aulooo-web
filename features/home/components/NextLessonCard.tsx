import { CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatDateTime, formatRelative, formatTime } from "@/shared/lib/format";
import type { NextLessonCardProps } from "./NextLessonCard.types";

export function NextLessonCard({ lesson }: NextLessonCardProps) {
  if (!lesson) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-1">
          <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <CalendarClock className="size-4" aria-hidden />
            Próxima aula
          </span>
          <p className="text-sm text-muted-foreground">Nenhuma aula agendada por enquanto.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-1">
        <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <CalendarClock className="size-4 text-primary" aria-hidden />
          Próxima aula
        </span>

        <p className="font-heading text-base font-semibold text-foreground first-letter:uppercase">
          {formatRelative(lesson.startsAt)}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatTime(lesson.startsAt)}–{formatTime(lesson.endsAt)}
        </p>

        <span className="sr-only">{formatDateTime(lesson.startsAt)}</span>
      </CardContent>
    </Card>
  );
}
