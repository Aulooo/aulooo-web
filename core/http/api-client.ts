import { redirect } from "next/navigation";
import { env } from "@/core/config/env";
import { ACCESS_TOKEN_COOKIE } from "@/core/cookies/constants";
import { deleteItemOnCookie } from "@/core/cookies/cookie-manager";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

// Assume ser chamado a partir de Server Action / Route Handler (onde cookies()/redirect() funcionam).
async function request<TResponse>(
  path: string,
  options: RequestOptions = {}
): Promise<TResponse> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    await deleteItemOnCookie(ACCESS_TOKEN_COOKIE);
    redirect("/sign-in");
  }

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<TResponse>;
}

export const apiClient = {
  get: <TResponse>(path: string, options?: RequestOptions) => request<TResponse>(path, { ...options, method: "GET" }),
  post: <TResponse>(path: string, body?: unknown, options?: RequestOptions) => request<TResponse>(path, { ...options, method: "POST", body }),
};
