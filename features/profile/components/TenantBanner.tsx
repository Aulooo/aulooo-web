import { env } from "@/core/config/env";
import type { TenantBranding } from "../lib/get-tenant-branding";

/** Mostrado nas telas públicas (sign-in, cadastro de aluno) quando o acesso veio pelo domínio de um professor. */
export function TenantBanner({ branding }: { branding: TenantBranding }) {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg border border-border">
      {branding.hasBanner ? (
        // eslint-disable-next-line @next/next/no-img-element -- URL absoluta pra API, next/image não se aplica
        <img
          src={`${env.apiUrl}/public/professors/by-slug/${branding.slug}/banner`}
          alt=""
          className="h-24 w-full object-cover"
        />
      ) : null}
      <p className="px-4 py-2 text-center text-sm text-muted-foreground">
        Você está acessando o espaço de{" "}
        <span
          className="font-semibold text-foreground"
          style={branding.brandColor ? { color: branding.brandColor } : undefined}
        >
          {branding.name}
        </span>
      </p>
    </div>
  );
}
