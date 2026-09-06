import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { initials } from "@/shared/lib/initials";
import { ROLE_LABEL } from "@/features/shell";
import type { PersonRowProps } from "./PersonRow.types";

export function PersonRow({ person, onSelect }: PersonRowProps) {
  const inactive = person.status === "inactive";

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
    >
      <span className="relative shrink-0">
        <Avatar size="sm">
          <AvatarFallback>{initials(person.name)}</AvatarFallback>
        </Avatar>
        {inactive ? (
          <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-muted-foreground ring-2 ring-card" />
        ) : null}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">{person.name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {person.roles.map((r) => ROLE_LABEL[r]).join(" · ")}
          {inactive ? " · inativo" : ""}
        </span>
      </span>

      <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
    </button>
  );
}
