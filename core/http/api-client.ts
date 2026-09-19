import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/core/config/env";
import { ACCESS_TOKEN_COOKIE } from "@/core/cookies/constants";
import { deleteItemOnCookie } from "@/core/cookies/cookie-manager";

/**
 * A API sempre responde HTTP 200, mesmo em erro — quem distingue sucesso/erro é o
 * envelope: code 1 = sucesso, 2 = erro esperado (com errorCode e opcionalmente
 * data.errors), 3 = erro inesperado. O client devolve o envelope pro chamador decidir;
 * só um 401/403 HTTP real (JWT rejeitado antes do controller) é tratado aqui.
 */
export type ApiEnvelope<TData> = {
  code: 1 | 2 | 3;
  message: string;
  data: TData | null;
  errorCode: string | null;
};

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

type ValidationErrorItem = { field: string; message: string };

/**
 * Em erro de validação (`errorCode === "VALIDATION_ERROR"`), `data` deixa de ser o
 * payload de sucesso e vira `{ errors: [{ field, message }] }`. Extrai isso pro
 * formato `{ campo: mensagem }` que as Server Actions devolvem pro `useActionState`.
 */
export function envelopeFieldErrors(envelope: ApiEnvelope<unknown>): Record<string, string> | undefined {
  if (envelope.errorCode !== "VALIDATION_ERROR") return undefined;

  const data = envelope.data as { errors?: ValidationErrorItem[] } | null;
  if (!data?.errors?.length) return undefined;

  const errors: Record<string, string> = {};
  for (const e of data.errors) {
    if (!errors[e.field]) errors[e.field] = e.message;
  }
  return errors;
}

async function authHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<TData>(response: Response): Promise<ApiEnvelope<TData>> {
  if (response.status === 401 || response.status === 403) {
    await deleteItemOnCookie(ACCESS_TOKEN_COOKIE);
    redirect("/sign-in");
  }

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<ApiEnvelope<TData>>;
}

async function request<TData>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiEnvelope<TData>> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  return handleResponse<TData>(response);
}

/**
 * Envio multipart (upload de arquivo) — o body é um `FormData` já pronto; não seta
 * `Content-Type` pra o fetch/undici gerar o boundary sozinho.
 */
async function requestForm<TData>(path: string, form: FormData): Promise<ApiEnvelope<TData>> {
  const response = await fetch(`${env.apiUrl}${path}`, {
    method: "POST",
    headers: await authHeader(),
    body: form,
  });

  return handleResponse<TData>(response);
}

export const apiClient = {
  get: <TData>(path: string, options?: RequestOptions) =>
    request<TData>(path, { ...options, method: "GET" }),
  post: <TData>(path: string, body?: unknown, options?: RequestOptions) =>
    request<TData>(path, { ...options, method: "POST", body }),
  put: <TData>(path: string, body?: unknown, options?: RequestOptions) =>
    request<TData>(path, { ...options, method: "PUT", body }),
  patch: <TData>(path: string, body?: unknown, options?: RequestOptions) =>
    request<TData>(path, { ...options, method: "PATCH", body }),
  delete: <TData>(path: string, options?: RequestOptions) =>
    request<TData>(path, { ...options, method: "DELETE" }),
  postForm: <TData>(path: string, form: FormData) => requestForm<TData>(path, form),
};
