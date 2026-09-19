import type { ProfessorBranding, ProfessorProfile, StudentProfile } from "../types";

export type ProfileViewProps = {
  profile: ProfessorProfile | StudentProfile;
  branding: ProfessorBranding | null;
};
