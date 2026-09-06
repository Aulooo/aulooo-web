import { HomeScreen } from "@/features/home";
import { getMockSession } from "@/mock/session";

export default async function HomePage() {
  const user = await getMockSession();

  return <HomeScreen user={user} />;
}
