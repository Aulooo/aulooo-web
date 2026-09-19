import { NextRequest, NextResponse } from "next/server";
import { isJwtExpired } from "@/core/auth/jwt";
import { ACCESS_TOKEN_COOKIE } from "@/core/cookies/constants";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up/professor", "/sign-up/student"]; // TODO: Colocar no .env as rotas publicas (fica mais fácil dar manutenção, seria legal até ter uma tabela que contra isso)

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const isAuthenticated = !!token && !isJwtExpired(token);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Multi-tenant por domínio: cada professor tem um slug (ex.: joao-silva);
  // acessar joao-silva.aulooo.com (ou joao-silva.localhost em dev) resolve
  // pra ele. O professor define/troca o slug no perfil (`/professors/me`).
  // Aqui só extrai o candidato do host e propaga via header interno — quem
  // decide se o slug existe de fato é a chamada pública em `getTenantBranding`
  // (features/profile). Um slug que não bate com nenhum professor real
  // simplesmente não resolve marca nenhuma (cai na identidade padrão do Aulooo).
  // `request.nextUrl.hostname` não reflete o Host real da requisição neste
  // setup (fica preso ao host/porta que o servidor Next escuta) — o header
  // cru é a fonte confiável de qual domínio o navegador realmente pediu.
  const hostname = (request.headers.get("host") ?? "").split(":")[0];
  const requestHeaders = new Headers(request.headers);
  const tenantSlug = resolveTenantSlug(hostname);
  if (tenantSlug) requestHeaders.set("x-tenant-slug", tenantSlug);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

/** "joao-silva.aulooo.com" | "joao-silva.localhost" → "joao-silva"; domínio raiz → null. */
function resolveTenantSlug(hostname: string): string | null {
  const labels = hostname.split(".");
  if (labels.length < 2) return null;

  const [first] = labels;
  return first === "www" ? null : first;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
