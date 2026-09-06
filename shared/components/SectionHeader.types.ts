import type { ReactNode } from "react";

export type SectionHeaderProps = {
  title: string;
  /** Ação à direita — normalmente um link "ver todos". */
  action?: ReactNode;
  className?: string;
};
