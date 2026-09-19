import Link from "next/link";
import { SignUpProfessorForm } from "@/features/auth";

export default async function SignUpProfessorPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
      <div className="w-full max-w-sm space-y-1 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Criar conta de professor</h1>
        <p className="text-sm text-muted-foreground">
          Use o código de convite que o administrador compartilhou com você.
        </p>
      </div>

      <SignUpProfessorForm defaultEntryCode={code} />

      <p className="text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
