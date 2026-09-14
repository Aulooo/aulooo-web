import { AnnouncementsView, getMyAnnouncements } from "@/features/announcements";
import { getCurrentProfile } from "@/features/profile";

export default async function AvisosPage() {
  const profile = await getCurrentProfile();
  const announcements = await getMyAnnouncements(profile.role);

  return (
    <AnnouncementsView
      announcements={announcements}
      mode={profile.role === "professor" ? "manage" : "read"}
    />
  );
}
