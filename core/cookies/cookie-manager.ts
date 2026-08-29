import { cookies } from "next/headers";

export async function saveItemOnCookie( paramName: string, paramValue: string ) {
  const cookieStore = await cookies();

  cookieStore.set(paramName, paramValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60
  });
}

export async function deleteItemOnCookie(paramName: string) {
  const cookieStore = await cookies();
  cookieStore.delete(paramName);
}