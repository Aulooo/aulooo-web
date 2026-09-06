import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "cn";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { MetricCardProps } from "./MetricCard.types";

/**
 * Cartão de métrica: número em destaque + rótulo + ícone opcional + variação.
 * Base dos dashboards (home do professor/admin).
 */
export function MetricCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaDirection = "up",
  invertDeltaColor = false,
  className,
}: MetricCardProps) {
  const isPositive = invertDeltaColor ? deltaDirection === "down" : deltaDirection === "up";
  const DeltaIcon = deltaDirection === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className={cn("gap-2", className)}>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          {Icon && (
            <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="size-4" aria-hidden />
            </span>
          )}
        </div>
        <span className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              isPositive ? "text-success" : "text-destructive"
            )}
          >
            <DeltaIcon className="size-3.5" aria-hidden />
            {delta}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
