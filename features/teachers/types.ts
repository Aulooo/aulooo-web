export type TeacherStatus = "active" | "inactive";

export type Teacher = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  email: string;
  status: TeacherStatus;
  studentCount: number;
  joinedAt: string;
};
