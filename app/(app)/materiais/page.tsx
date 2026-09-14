import { MateriaisView, getMaterialsForStudent, getMyMaterialsAsStudent } from "@/features/documents";
import { getMyStudents } from "@/features/students";
import { getCurrentProfile } from "@/features/profile";

export default async function MateriaisPage() {
  const profile = await getCurrentProfile();

  if (profile.role === "aluno") {
    const documents = await getMyMaterialsAsStudent();
    return <MateriaisView documents={documents} mode="read" students={[]} studentNameById={{}} />;
  }

  const students = await getMyStudents();
  const perStudent = await Promise.all(students.map((s) => getMaterialsForStudent(s.studentId)));

  return (
    <MateriaisView
      documents={perStudent.flat()}
      mode="manage"
      students={students.map((s) => ({ id: s.studentId, name: s.name }))}
      studentNameById={Object.fromEntries(students.map((s) => [s.studentId, s.name]))}
    />
  );
}
