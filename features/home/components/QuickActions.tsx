import Link from "next/link";
import { cn } from "cn";
import type { QuickActionsProps } from "./QuickActions.types";

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div
      className={cn("grid grid-cols-2 gap-3", actions.length >= 3 && "sm:grid-cols-4")}
    >
      {actions.map(({ label, href, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className="flex flex-col gap-2 rounded-xl bg-card p-3 ring-1 ring-foreground/10 transition-colors hover:bg-muted/60"
        >
          <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="size-4" aria-hidden />
          </span>
          <span className="text-sm font-medium text-foreground">{label}</span>
        </Link>
      ))}
    </div>
  );
}
