import { Megaphone, UserPlus, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { formatRelative } from "@/shared/lib/format";
import type { ActivityKind } from "../types";
import type { ActivityFeedProps } from "./ActivityFeed.types";

const KIND_ICON: Record<ActivityKind, LucideIcon> = {
  payment: Wallet,
  student: UserPlus,
  announcement: Megaphone,
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <Card>
        <p className="px-4 text-sm text-muted-foreground">Sem atividade recente.</p>
      </Card>
    );
  }

  return (
    <Card className="py-0">
      <ul className="divide-y divide-border">
        {items.map((item) => {
          const Icon = KIND_ICON[item.kind];
          return (
            <li key={item.id} className="flex items-center gap-3 px-4 py-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="size-4" aria-hidden />
              </span>
              <p className="min-w-0 flex-1 text-sm text-foreground">{item.text}</p>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatRelative(item.at)}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
