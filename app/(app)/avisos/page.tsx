import { redirect } from "next/navigation";
import { AnnouncementsView, getMyAnnouncements } from "@/features/announcements";
import { getCurrentProfile } from "@/features/profile";
import { getMyStudents } from "@/features/students";

export default async function AvisosPage() {
  const profile = await getCurrentProfile();
  if (profile.role === "admin") redirect("/home");

  const announcements = await getMyAnnouncements(profile.role);
  const students = profile.role === "professor" ? await getMyStudents() : [];

  return (
    <AnnouncementsView
      announcements={announcements}
      mode={profile.role === "professor" ? "manage" : "read"}
      students={students.map((s) => ({ id: s.studentId, name: s.name }))}
    />
  );
}
