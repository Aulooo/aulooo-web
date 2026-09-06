import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};
