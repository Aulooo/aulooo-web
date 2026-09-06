"use client"
import { sendSignInAction } from "@/app/(auth)/sign-in/action/sign-in-action";
import { Button } from "@/shared/components/ui/button";
import { useActionState } from "react";


export function SignInForm() {
  const [state, formAction, isPending] = useActionState(sendSignInAction, { success: false, message: ""});

  return (
    <form className="flex w-full max-w-sm flex-col gap-4" action={formAction}>
      <label className="flex flex-col gap-1 text-sm">
        E-mail
        <input
          type="email"
          name="email"
          min={5}
          max={255}
          required
          className="h-11 rounded-lg border border-black/[.08] px-3 dark:border-white/[.145]"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Senha
        <input
          type="password"
          name="password"
          min={8}
          max={255}
          required
          className="h-11 rounded-lg border border-black/[.08] px-3 dark:border-white/[.145]"
        />
      </label>

      {state.success == false && <p className="text-sm text-red-600">{state.message}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
