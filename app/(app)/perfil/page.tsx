import { notFound } from "next/navigation";
import { ProfileView } from "@/features/profile";
import { getMockSession } from "@/mock/session";
import { peopleDb } from "@/mock/db/people";

export default async function PerfilPage() {
  const user = await getMockSession();
  const person = await peopleDb.get(user.id);
  if (!person) notFound();

  return <ProfileView person={person} />;
}
