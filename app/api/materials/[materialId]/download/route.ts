import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/core/config/env";
import { ACCESS_TOKEN_COOKIE } from "@/core/cookies/constants";
import { getCurrentProfile } from "@/features/profile";

/**
 * A API real exige Bearer no download (nunca expõe URL pública) e o token vive num
 * cookie httpOnly — o browser não pode chamar `${apiUrl}/.../download` direto. Esta
 * rota faz o proxy: resolve o papel via `getCurrentProfile()`, injeta o token e
 * repassa o stream binário com os mesmos headers.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ materialId: string }> },
) {
  const { materialId } = await params;

  const [profile, cookieStore] = await Promise.all([getCurrentProfile(), cookies()]);
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  const path =
    profile.role === "aluno"
      ? `/students/me/materials/${materialId}/download`
      : `/professors/me/materials/${materialId}/download`;

  const upstream = await fetch(`${env.apiUrl}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ message: "Não foi possível baixar o material." }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
      "Content-Disposition": upstream.headers.get("content-disposition") ?? "attachment",
    },
  });
}
