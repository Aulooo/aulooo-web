import { apiClient } from "@/core/http/api-client";
import type {
  AuthenticatedUser,
  ProfessorSignUpInput,
  SignInCredentials,
  StudentSignUpInput,
} from "../types";

export const authApi = {
  signIn: (credentials: SignInCredentials) =>
    apiClient.post<AuthenticatedUser>("/auth/sign-in", credentials),

  signUpProfessor: (input: ProfessorSignUpInput) =>
    apiClient.post<AuthenticatedUser>("/auth/sign-up/professor", input),

  signUpStudent: (input: StudentSignUpInput) =>
    apiClient.post<AuthenticatedUser>("/auth/sign-up/student", input),
};
