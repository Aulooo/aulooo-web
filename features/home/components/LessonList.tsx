import { MapPin, Video } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { formatTime } from "@/shared/lib/format";
import type { LessonListProps } from "./LessonList.types";

export function LessonList({ lessons, emptyLabel = "Nada na agenda." }: LessonListProps) {
  if (lessons.length === 0) {
    return (
      <Card>
        <p className="px-4 text-sm text-muted-foreground">{emptyLabel}</p>
      </Card>
    );
  }

  return (
    <Card className="py-0">
      <ul className="divide-y divide-border">
        {lessons.map((lesson) => {
          const online = lesson.mode === "online";
          return (
            <li key={lesson.id} className="flex items-center gap-3 px-4 py-3">
              <span className="w-12 shrink-0 text-sm font-semibold tabular-nums text-foreground">
                {formatTime(lesson.startsAt)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{lesson.title}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  {online ? (
                    <Video className="size-3.5 shrink-0" aria-hidden />
                  ) : (
                    <MapPin className="size-3.5 shrink-0" aria-hidden />
                  )}
                  <span className="truncate">{online ? "Online" : lesson.location}</span>
                  <span aria-hidden>·</span>
                  {lesson.durationMin} min
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
