import type { ReactNode } from "react";
import { AppShell } from "@/features/shell";
import { getCurrentProfile, toSessionUser } from "@/features/profile";
import { TourGuide } from "@/features/tour";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentProfile();
  const user = toSessionUser(profile);

  return (
    <>
      <AppShell user={user}>{children}</AppShell>
      <TourGuide role={user.role} userId={user.id} />
    </>
  );
}
