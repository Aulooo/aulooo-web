"use server";

import { redirect } from "next/navigation";
import { deleteItemOnCookie } from "@/core/cookies/cookie-manager";
import { ACCESS_TOKEN_COOKIE, ACCOUNT_ROLE_COOKIE } from "@/core/cookies/constants";

/** Limpa os cookies httpOnly da sessão e volta para o login. */
export async function signOut(): Promise<void> {
  await deleteItemOnCookie(ACCESS_TOKEN_COOKIE);
  await deleteItemOnCookie(ACCOUNT_ROLE_COOKIE);
  redirect("/sign-in");
}
