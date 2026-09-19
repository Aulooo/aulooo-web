import { redirect } from "next/navigation";
import { ReschedulingRequestsView, getMyRequests, getPolicy } from "@/features/rescheduling";
import type { RequestWithStudent } from "@/features/rescheduling";
import { getClassAsProfessor } from "@/features/schedule";
import { getMyStudents } from "@/features/students";
import { getCurrentProfile } from "@/features/profile";

export default async function ReagendamentosPage() {
  const profile = await getCurrentProfile();
  if (profile.role !== "professor") redirect("/home");

  const [requests, policy, students] = await Promise.all([
    getMyRequests("professor"),
    getPolicy(),
    getMyStudents(),
  ]);

  const studentNameById = Object.fromEntries(students.map((s) => [s.studentId, s.name]));

  const items: RequestWithStudent[] = await Promise.all(
    requests.map(async (request) => {
      const lesson = await getClassAsProfessor(request.classId);
      const studentName = (lesson?.studentId && studentNameById[lesson.studentId]) || "Aluno";
      return { request, studentName };
    }),
  );

  return <ReschedulingRequestsView items={items} policy={policy} />;
}
