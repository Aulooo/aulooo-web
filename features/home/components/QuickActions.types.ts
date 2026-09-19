import type { LucideIcon } from "lucide-react";

export type QuickAction = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type QuickActionsProps = {
  actions: QuickAction[];
};
