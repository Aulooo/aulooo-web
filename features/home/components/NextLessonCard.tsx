import { CalendarClock, MapPin, Video } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
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

  const online = lesson.mode === "online";

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <CalendarClock className="size-4 text-primary" aria-hidden />
          Próxima aula
        </span>

        <div className="space-y-0.5">
          <p className="font-heading text-base font-semibold text-foreground">{lesson.title}</p>
          <p className="text-sm text-muted-foreground first-letter:uppercase">
            {formatRelative(lesson.startsAt)} · {formatTime(lesson.startsAt)} · {lesson.durationMin} min
          </p>
        </div>

        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {online ? (
            <Video className="size-4 shrink-0" aria-hidden />
          ) : (
            <MapPin className="size-4 shrink-0" aria-hidden />
          )}
          <span className="truncate">{online ? "Aula online" : lesson.location}</span>
        </span>

        {online && lesson.location ? (
          <Button asChild size="sm" className="self-start">
            <a href={lesson.location} target="_blank" rel="noreferrer">
              Entrar na chamada
            </a>
          </Button>
        ) : null}

        <span className="sr-only">{formatDateTime(lesson.startsAt)}</span>
      </CardContent>
    </Card>
  );
}
