import { cn } from "cn";
import type { SectionHeaderProps } from "./SectionHeader.types";

/** Cabeçalho de seção: título + ação opcional (ex: link "ver todos"). */
export function SectionHeader({ title, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-baseline justify-between gap-3", className)}>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {action}
    </div>
  );
}
