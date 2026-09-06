import type { Announcement } from "@/features/announcements";
import type { StudyDocument } from "@/features/documents";
import type { Payment } from "@/features/payments";
import type { Lesson } from "@/features/schedule";

/** Pagamento em aberto já enriquecido com o nome do aluno e o atraso. */
export type PendingPayment = {
  payment: Payment;
  studentName: string;
  daysOverdue: number;
};

export type StudentHomeData = {
  firstName: string;
  nextLesson: Lesson | null;
  currentPayment: Payment | null;
  announcements: Announcement[];
  documents: StudyDocument[];
};

export type ProfessorHomeData = {
  firstName: string;
  activeStudents: number;
  receivedCents: number;
  toReceiveCents: number;
  lessonsToday: Lesson[];
  pendingPayments: PendingPayment[];
  announcements: Announcement[];
};

export type ActivityKind = "payment" | "student" | "announcement";

export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  text: string;
  at: string;
};

export type AdminHomeData = {
  firstName: string;
  tenantName: string;
  activeStudents: number;
  activeTeachers: number;
  revenueCents: number;
  overdueCents: number;
  overdueCount: number;
  activity: ActivityItem[];
};
