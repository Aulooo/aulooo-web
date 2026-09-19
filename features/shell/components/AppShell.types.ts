import type { ReactNode } from "react";
import type { SessionUser } from "@/features/auth";

export type AppShellProps = {
  user: SessionUser;
  children: ReactNode;
};
