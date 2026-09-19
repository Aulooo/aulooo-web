import { redirect } from "next/navigation";
import { StudentsView, getMyStudents } from "@/features/students";
import { getCurrentProfile } from "@/features/profile";

export default async function AlunosPage() {
  const profile = await getCurrentProfile();
  if (profile.role !== "professor") redirect("/home");

  const students = await getMyStudents();

  return <StudentsView students={students} />;
}
