"use client";

import { useState } from "react";
import { authApi } from "../api/auth-api";
import type { AuthenticatedUser, LoginCredentials } from "../types";

type UseLoginResult = {
  login: (credentials: LoginCredentials) => Promise<void>;
  user: AuthenticatedUser | null;
  isLoading: boolean;
  error: string | null;
};

export function useLogin(): UseLoginResult {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(credentials: LoginCredentials) {
    setIsLoading(true);
    setError(null);

    try {
      const authenticatedUser = await authApi.login(credentials);
      setUser(authenticatedUser);
    } catch {
      setError("Não foi possível entrar. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  }

  return { login, user, isLoading, error };
}
