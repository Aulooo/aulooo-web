import { saveItemOnCookie } from "@/core/cookies/cookie-manager";
import { ACCESS_TOKEN_COOKIE, ACCOUNT_ROLE_COOKIE } from "@/core/cookies/constants";
import type { AuthenticatedUser } from "../types";

/** Login/cadastro bem-sucedido: grava o accessToken e o papel real em cookie. */
export async function applyAuthSuccess(data: AuthenticatedUser): Promise<void> {
  await saveItemOnCookie(ACCESS_TOKEN_COOKIE, data.accessToken);
  await saveItemOnCookie(ACCOUNT_ROLE_COOKIE, data.user.role);
}
