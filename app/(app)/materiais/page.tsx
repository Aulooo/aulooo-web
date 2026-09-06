import { MateriaisView } from "@/features/documents";
import { getMockSession } from "@/mock/session";
import { documentsDb } from "@/mock/db/documents";
import { peopleDb } from "@/mock/db/people";

export default async function MateriaisPage() {
  const user = await getMockSession();

  if (user.role === "aluno") {
    const documents = await documentsDb.forStudent(user.id);
    return (
      <MateriaisView documents={documents} mode="read" authorId={user.id} students={[]} studentNameById={{}} />
    );
  }

  const [all, students] = await Promise.all([
    documentsDb.list(),
    peopleDb.students(user.role === "professor" ? user.id : undefined),
  ]);
  const documents = user.role === "professor" ? all.filter((d) => d.authorId === user.id) : all;

  return (
    <MateriaisView
      documents={documents}
      mode="manage"
      authorId={user.id}
      students={students.map((s) => ({ id: s.id, name: s.name }))}
      studentNameById={Object.fromEntries(students.map((s) => [s.id, s.name]))}
    />
  );
}
