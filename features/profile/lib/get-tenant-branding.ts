import { getTenantSlug } from "@/core/tenant/get-tenant-slug";
import { profileApi } from "../api/profile-api";
import type { PublicProfessorBranding } from "../api/profile-api";

export type TenantBranding = PublicProfessorBranding & { slug: string };

/** Marca do professor dono do domínio atual (resolvido pelo proxy) — `null` fora de um link de professor. */
export async function getTenantBranding(): Promise<TenantBranding | null> {
  const slug = await getTenantSlug();
  if (!slug) return null;

  const result = await profileApi.getPublicProfessorBySlug(slug);
  return result.code === 1 && result.data ? { ...result.data, slug } : null;
}
