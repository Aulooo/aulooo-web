import { redirect } from "next/navigation";
import { AvailabilityView, getMyAvailabilities } from "@/features/availability";
import { getCurrentProfile } from "@/features/profile";

export default async function DisponibilidadePage() {
  const profile = await getCurrentProfile();
  if (profile.role !== "professor") redirect("/home");

  const availabilities = await getMyAvailabilities();

  return <AvailabilityView availabilities={availabilities} />;
}
