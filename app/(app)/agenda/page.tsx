import { redirect } from "next/navigation";
import { AgendaView, defaultAgendaRange, getMyClasses, getStudentSlots } from "@/features/schedule";
import { getMyStudents } from "@/features/students";
import { getCurrentProfile } from "@/features/profile";
import { getMyRequests, getPolicyAsStudent } from "@/features/rescheduling";

function slotsRange(): { from: string; to: string } {
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const from = new Date();
  const to = new Date();
  to.setDate(to.getDate() + 30);
  return { from: iso(from), to: iso(to) };
}

export default async function AgendaPage() {
  const profile = await getCurrentProfile();
  if (profile.role === "admin") redirect("/home");

  const { from, to } = defaultAgendaRange();
  const lessons = await getMyClasses(profile.role, from, to);

  if (profile.role === "aluno") {
    const [myRequests, policy] = await Promise.all([getMyRequests("aluno"), getPolicyAsStudent()]);
    const allowSelfScheduling = policy?.allowStudentSelfScheduling ?? false;
    const range = slotsRange();
    const slots = allowSelfScheduling ? await getStudentSlots(range.from, range.to) : [];

    return (
      <AgendaView
        lessons={lessons}
        mode="read"
        students={[]}
        studentNameById={{}}
        myRequests={myRequests}
        allowSelfScheduling={allowSelfScheduling}
        slots={slots}
      />
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
