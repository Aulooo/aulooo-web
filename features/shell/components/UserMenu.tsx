"use client";

import Link from "next/link";
import { LogOut, Settings, UserRound } from "lucide-react";
import { signOut } from "@/features/auth/actions/sign-out";
import { initials } from "@/shared/lib/initials";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ROLE_LABEL } from "../role-label";
import type { UserMenuProps } from "./UserMenu.types";

/** Avatar + menu de perfil (Perfil / Configurações / Sair). Usado no header e na sidebar. */
export function UserMenu({ user, align = "end", side = "bottom" }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Abrir menu do perfil"
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Avatar>
            {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : null}
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} side={side} className="w-56">
        <DropdownMenuLabel className="text-foreground">
          <span className="block text-sm font-medium">{user.name}</span>
          <span className="block text-xs font-normal text-muted-foreground">
            {ROLE_LABEL[user.role]} · {user.tenantName}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/perfil">
            <UserRound />
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/perfil">
            <Settings />
            Configurações
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" asChild>
          <form action={signOut} className="w-full">
            <button type="submit" className="flex w-full items-center gap-1.5">
              <LogOut />
              Sair
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
