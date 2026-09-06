import { redirect } from "next/navigation";
import { PeopleView } from "@/features/people";
import { getMockSession } from "@/mock/session";
import { peopleStore } from "@/mock/people-store";

export default async function UsuariosPage() {
  const user = await getMockSession();
  if (user.role !== "admin") redirect("/home");

  const people = await peopleStore.list();

  return <PeopleView people={people} />;
}
