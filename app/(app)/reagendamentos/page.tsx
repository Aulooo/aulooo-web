import { redirect } from "next/navigation";
import {
  ReschedulingRequestsView,
  getMyRequests,
  getMySchedulingRequests,
  getPolicy,
} from "@/features/rescheduling";
import type { RequestWithStudent, SchedulingRequestWithStudent } from "@/features/rescheduling";
import { getClassAsProfessor } from "@/features/schedule";
import { getMyStudents } from "@/features/students";
import { getCurrentProfile } from "@/features/profile";

export default async function ReagendamentosPage() {
  const profile = await getCurrentProfile();
  if (profile.role !== "professor") redirect("/home");

  const [requests, schedulingRequests, policy, students] = await Promise.all([
    getMyRequests("professor"),
    getMySchedulingRequests("professor"),
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

  const newClassItems: SchedulingRequestWithStudent[] = schedulingRequests.map((request) => ({
    request,
    studentName: studentNameById[request.studentId] || "Aluno",
  }));

  return <ReschedulingRequestsView items={items} schedulingRequests={newClassItems} policy={policy} />;
}
