import { AnnouncementsView } from "@/features/announcements";
import { getMockSession } from "@/mock/session";
import { announcementsDb } from "@/mock/db/announcements";
import { peopleDb } from "@/mock/db/people";

export default async function AvisosPage() {
  const user = await getMockSession();

  if (user.role === "aluno") {
    const announcements = await announcementsDb.forStudent(user.id);
    return (
      <AnnouncementsView
        announcements={announcements}
        mode="read"
        authorId={user.id}
        students={[]}
        studentNameById={{}}
      />
    );
  }

  // professor / admin
  const [all, students] = await Promise.all([
    announcementsDb.list(),
    peopleDb.students(user.role === "professor" ? user.id : undefined),
  ]);

  const announcements =
    user.role === "professor" ? all.filter((a) => a.authorId === user.id) : all;

  return (
    <AnnouncementsView
      announcements={announcements}
      mode="manage"
      authorId={user.id}
      students={students.map((s) => ({ id: s.id, name: s.name }))}
      studentNameById={Object.fromEntries(students.map((s) => [s.id, s.name]))}
    />
  );
}
