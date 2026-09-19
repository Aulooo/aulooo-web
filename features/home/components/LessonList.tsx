import { Clock } from "lucide-react";
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
        {lessons.map((lesson) => (
          <li key={lesson.id} className="flex items-center gap-3 px-4 py-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Clock className="size-4" aria-hidden />
            </span>
            <span className="text-sm font-medium text-foreground">
              {formatTime(lesson.startsAt)}–{formatTime(lesson.endsAt)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
