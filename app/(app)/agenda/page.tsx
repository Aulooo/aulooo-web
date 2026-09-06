import { redirect } from "next/navigation";
import { AgendaView } from "@/features/schedule";
import { getMockSession } from "@/mock/session";
import { lessonsDb } from "@/mock/db/lessons";
import { peopleDb } from "@/mock/db/people";

export default async function AgendaPage() {
  const user = await getMockSession();
  if (user.role === "admin") redirect("/home");

  if (user.role === "aluno") {
    const lessons = await lessonsDb.forStudent(user.id);
    return (
      <AgendaView
        lessons={lessons}
        mode="read"
        teacherId=""
        students={[]}
        studentNameById={{}}
      />
    );
  }

  const [lessons, students] = await Promise.all([
    lessonsDb.forTeacher(user.id),
    peopleDb.students(user.id),
  ]);

  return (
    <AgendaView
      lessons={lessons}
      mode="manage"
      teacherId={user.id}
      students={students.map((s) => ({ id: s.id, name: s.name }))}
      studentNameById={Object.fromEntries(students.map((s) => [s.id, s.name]))}
    />
  );
}
