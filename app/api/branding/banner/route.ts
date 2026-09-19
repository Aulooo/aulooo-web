import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/core/config/env";
import { ACCESS_TOKEN_COOKIE } from "@/core/cookies/constants";

/** Proxy autenticado pra `GET /professors/me/branding/banner`. */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });

  const upstream = await fetch(`${env.apiUrl}/professors/me/branding/banner`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ message: "Sem banner." }, { status: 404 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
      "Cache-Control": "no-store",
    },
  });
}
