import { headers } from "next/headers";

/**
 * Slug do professor dono do domínio atual, resolvido pelo `proxy.ts`
 * (`joao-silva.aulooo.com` → "joao-silva"). `null` fora de um link de professor
 * (domínio raiz, IP, etc.).
 */
export async function getTenantSlug(): Promise<string | null> {
  const headerList = await headers();
  return headerList.get("x-tenant-slug");
}
