import type { ProfessorBranding, ProfessorProfile, StudentProfessorSummary, StudentProfile } from "../types";

export type ProfileViewProps = {
  profile: ProfessorProfile | StudentProfile;
  branding: ProfessorBranding | null;
  myProfessor?: StudentProfessorSummary | null;
};
