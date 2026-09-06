"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { cn } from "cn";
import { Logo } from "@/shared/brand/Logo";
import { Button } from "@/shared/components/ui/button";
import { NAV_BY_ROLE } from "../nav-config";
import { ROLE_LABEL } from "../role-label";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import type { SidebarProps } from "./Sidebar.types";

/** Navegação lateral — só no desktop (`md+`). Substitui a BottomNav. */
export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[user.role];

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
      <Link
        href="/home"
        className="flex h-14 items-center gap-2 border-b border-border px-4"
        aria-label="Ir para o início"
      >
        <Logo size="sm" priority />
        <span className="truncate text-sm font-semibold text-foreground">{user.tenantName}</span>
      </Link>

      <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-2 border-t border-border p-3">
        <div className="flex items-center gap-2">
          <UserMenu user={user} align="start" side="top" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{ROLE_LABEL[user.role]}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Notificações">
            <Bell />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
