import { AdminProfileView, ProfileView, getCurrentProfile, getMyBranding } from "@/features/profile";

export default async function PerfilPage() {
  const profile = await getCurrentProfile();

  if (profile.role === "admin") {
    return <AdminProfileView profile={profile} />;
  }

  const branding = profile.role === "professor" ? await getMyBranding() : null;

  return <ProfileView profile={profile} branding={branding} />;
}
