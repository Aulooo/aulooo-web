import { ProfileView, getCurrentProfile, getMyBranding } from "@/features/profile";

export default async function PerfilPage() {
  const profile = await getCurrentProfile();
  const branding = profile.role === "professor" ? await getMyBranding() : null;

  return <ProfileView profile={profile} branding={branding} />;
}
