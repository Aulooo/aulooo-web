import Link from "next/link";
import { SignInForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
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
