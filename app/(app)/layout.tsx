import type { ReactNode } from "react";
import { AppShell } from "@/features/shell";
import { RoleSwitcher } from "@/features/dev";
import { getMockSession } from "@/mock/session";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getMockSession();

  return (
    <>
      <AppShell user={user}>{children}</AppShell>
      {process.env.NODE_ENV !== "production" && <RoleSwitcher currentRole={user.role} />}
    </>
  );
}
