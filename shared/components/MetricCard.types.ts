import type { LucideIcon } from "lucide-react";

export type MetricCardProps = {
  label: string;
  value: string;
  icon?: LucideIcon;
  /** Variação relativa ao período anterior, ex: "+12%". */
  delta?: string;
  deltaDirection?: "up" | "down";
  /** `up` bom em verde ou ruim em vermelho? Padrão: up = positivo. */
  invertDeltaColor?: boolean;
  className?: string;
};
