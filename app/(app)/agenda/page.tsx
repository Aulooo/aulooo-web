import { redirect } from "next/navigation";
import { AgendaView, defaultAgendaRange, getMyClasses } from "@/features/schedule";
import { getMyStudents } from "@/features/students";
import { getCurrentProfile } from "@/features/profile";
import { getMyRequests } from "@/features/rescheduling";

export default async function AgendaPage() {
  const profile = await getCurrentProfile();
  if (profile.role === "admin") redirect("/home");

  const { from, to } = defaultAgendaRange();
  const lessons = await getMyClasses(profile.role, from, to);

  if (profile.role === "aluno") {
    const myRequests = await getMyRequests("aluno");
    return (
      <AgendaView lessons={lessons} mode="read" students={[]} studentNameById={{}} myRequests={myRequests} />
    );
  }

  const students = await getMyStudents();

  return (
    <AgendaView
      lessons={lessons}
      mode="manage"
      students={students.map((s) => ({ id: s.studentId, name: s.name }))}
      studentNameById={Object.fromEntries(students.map((s) => [s.studentId, s.name]))}
    />
  );
}
