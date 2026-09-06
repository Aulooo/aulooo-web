import { redirect } from "next/navigation";
import { PeopleView } from "@/features/people";
import { getMockSession } from "@/mock/session";
import { peopleDb } from "@/mock/db/people";

export default async function AlunosPage() {
  const user = await getMockSession();
  if (user.role !== "professor") redirect("/home");

  const people = await peopleDb.list();

  return <PeopleView people={people} scope="my-students" currentUser={user} />;
}
