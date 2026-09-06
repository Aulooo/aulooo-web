import { NextRequest, NextResponse } from "next/server";
import { isJwtExpired } from "@/core/auth/jwt";
import { ACCESS_TOKEN_COOKIE } from "@/core/cookies/constants";

const PUBLIC_ROUTES = ["/sign-in"]; // TODO: Colocar no .env as rotas publicas (fica mais fácil dar manutenção, seria legal até ter uma tabela que contra isso)

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ----------------------------------------------------------------------------
  // DEV BYPASS — enquanto o backend de autenticação não existe, libera todas as
  // rotas em desenvolvimento para permitir trabalhar o front sem login real.
  // REMOVER quando o fluxo de auth do backend estiver pronto.
  // ----------------------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const isAuthenticated = !!token && !isJwtExpired(token);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
