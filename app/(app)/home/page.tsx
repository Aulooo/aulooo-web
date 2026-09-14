import { HomeScreen } from "@/features/home";
import { getCurrentProfile, toSessionUser } from "@/features/profile";

export default async function HomePage() {
  const profile = await getCurrentProfile();

  return <HomeScreen user={toSessionUser(profile)} />;
}
