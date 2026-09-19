import Link from "next/link";
import { SignInForm } from "@/features/auth";
import { TenantBanner, getTenantBranding } from "@/features/profile";

export default async function LoginPage() {
  const branding = await getTenantBranding();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
      {branding ? <TenantBanner branding={branding} /> : null}
      <h1 className="text-2xl font-semibold">Entrar</h1>
      <SignInForm />
      <p className="text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link href="/sign-up/professor" className="font-medium text-primary hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
