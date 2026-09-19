import type { ReactNode } from "react";
import { AppShell } from "@/features/shell";
import { getCurrentProfile, getMyBrandColor, toSessionUser, BrandThemeStyle } from "@/features/profile";
import { TourGuide } from "@/features/tour";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentProfile();
  const user = toSessionUser(profile);
  const brandColor = await getMyBrandColor(profile.role);

  return (
    <>
      <BrandThemeStyle color={brandColor} />
      <AppShell user={user}>{children}</AppShell>
      {profile.role !== "admin" ? <TourGuide role={profile.role} initialCompleted={profile.tourCompleted} /> : null}
    </>
  );
}
