import { apiClient } from "@/core/http/api-client";
import type { ApiRole } from "@/features/auth";
import type {
  ProfessorBranding,
  ProfessorBrandingInput,
  ProfessorProfile,
  StudentProfile,
  UpdateProfessorProfileInput,
  UpdateStudentProfileInput,
} from "../types";

/** `data` de `GET /auth/me` (AUTH-04) — usado só pra resolver o papel do usuário logado. */
export type CurrentUser = {
  userId: string;
  email: string;
  role: ApiRole;
  accountStatus: string;
  profileId: string;
  profileSummary: unknown;
};

type RawProfessorProfile = Omit<ProfessorProfile, "role">;
type RawStudentProfile = Omit<StudentProfile, "role">;

export const profileApi = {
  getCurrentUser: () => apiClient.get<CurrentUser>("/auth/me"),

  getProfessorProfile: () => apiClient.get<RawProfessorProfile>("/professors/me"),
  updateProfessorProfile: (input: UpdateProfessorProfileInput) =>
    apiClient.patch<RawProfessorProfile>("/professors/me", input),

  getStudentProfile: () => apiClient.get<RawStudentProfile>("/students/me"),
  updateStudentProfile: (input: UpdateStudentProfileInput) =>
    apiClient.patch<RawStudentProfile>("/students/me", input),

  updateEmail: (email: string) => apiClient.patch<{ email: string }>("/me/email", { email }),

  uploadAvatar: (form: FormData) => apiClient.postForm<{ hasAvatar: boolean }>("/me/avatar", form),

  getBranding: () => apiClient.get<ProfessorBranding>("/professors/me/branding"),
  updateBranding: (input: ProfessorBrandingInput) =>
    apiClient.patch<ProfessorBranding>("/professors/me/branding", input),
  uploadBanner: (form: FormData) =>
    apiClient.postForm<{ hasBanner: boolean }>("/professors/me/branding/banner", form),
};
