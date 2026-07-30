import { apiClient } from "@/core/http/api-client";
import type { AuthenticatedUser, LoginCredentials } from "../types";

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthenticatedUser>("/auth/login", credentials),
};
