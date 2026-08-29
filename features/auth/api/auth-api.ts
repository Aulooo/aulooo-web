import { apiClient } from "@/core/http/api-client";
import type { AuthenticatedUser, SignInCredentials } from "../types";

export const authApi = {
  signIn: (credentials: SignInCredentials) => apiClient.post<AuthenticatedUser>("/auth/sign-in", credentials),
};
