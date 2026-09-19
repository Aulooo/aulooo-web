"use client";

import Link from "next/link";
import { Logo } from "@/shared/brand/Logo";
import { NotificationBell } from "@/features/notifications";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import type { AppHeaderProps } from "./AppHeader.types";

/** Top bar — só no mobile. No desktop a navegação/identidade vivem na Sidebar. */
export function AppHeader({ user }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur md:hidden">
      <div className="mx-auto flex h-14 w-full max-w-lg items-center justify-between gap-2 px-4">
        <Link
          href="/home"
          className="flex min-w-0 items-center gap-2"
          aria-label="Ir para o início"
        >
          <Logo size="sm" priority />
          <span className="truncate text-sm font-semibold text-foreground">
            {user.tenantName}
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-0.5">
          <ThemeToggle />
          {user.role !== "admin" ? <NotificationBell role={user.role} /> : null}
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
