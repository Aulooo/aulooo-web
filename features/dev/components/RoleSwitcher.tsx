"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Check, FlaskConical } from "lucide-react";
import type { Role } from "@/features/auth";
import { MOCK_ROLE_COOKIE, MOCK_ROLES } from "@/mock/role-cookie";
import { ROLE_LABEL } from "@/features/shell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { RoleSwitcherProps } from "./RoleSwitcher.types";

/**
 * Ferramenta SÓ de desenvolvimento: troca o papel da sessão mockada
 * gravando o cookie `aulooo_mock_role` e recarregando os server components.
 * Montada condicionalmente em `app/(app)/layout.tsx` (NODE_ENV !== production).
 */
export function RoleSwitcher({ currentRole }: RoleSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function selectRole(role: Role) {
    if (role === currentRole) return;
    document.cookie = `${MOCK_ROLE_COOKIE}=${role}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div className="fixed bottom-20 right-3 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            data-pending={isPending || undefined}
            className="flex items-center gap-2 rounded-full border border-dashed border-brand-warm/50 bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-md backdrop-blur transition-opacity data-[pending]:opacity-60"
          >
            <FlaskConical className="size-3.5 text-brand-warm" aria-hidden />
            <span className="text-muted-foreground">papel:</span>
            {ROLE_LABEL[currentRole]}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="w-44">
          <DropdownMenuLabel>Dev · trocar papel</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {MOCK_ROLES.map((role) => (
            <DropdownMenuItem key={role} onSelect={() => selectRole(role)}>
              <Check
                className={role === currentRole ? "opacity-100" : "opacity-0"}
                aria-hidden
              />
              {ROLE_LABEL[role]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
