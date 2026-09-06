import { Megaphone, Pin } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { formatRelative } from "@/shared/lib/format";
import type { AnnouncementListProps } from "./AnnouncementList.types";

export function AnnouncementList({ announcements }: AnnouncementListProps) {
  if (announcements.length === 0) {
    return (
      <Card>
        <p className="px-4 text-sm text-muted-foreground">Nenhum aviso por aqui.</p>
      </Card>
    );
  }

  return (
    <Card className="py-0">
      <ul className="divide-y divide-border">
        {announcements.map((a) => (
          <li key={a.id} className="flex gap-3 px-4 py-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              {a.pinned ? <Pin className="size-4" aria-hidden /> : <Megaphone className="size-4" aria-hidden />}
            </span>
            <div className="min-w-0 space-y-0.5">
              <p className="text-sm font-medium text-foreground">{a.title}</p>
              <p className="line-clamp-2 text-sm text-muted-foreground">{a.body}</p>
              <p className="text-xs text-muted-foreground">{formatRelative(a.publishedAt)}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
