"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { NAV_BY_ROLE } from "../nav-config";
import type { BottomNavProps } from "./BottomNav.types";

/** Barra de navegação inferior (mobile-first). Item ativo destacado em --primary. */
export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];

  return (
    <nav
      aria-label="Navegação principal"
      className="sticky bottom-0 z-40 w-full border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex w-full max-w-lg items-stretch justify-around">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <li key={item.href} className="min-w-0 flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex w-full flex-col items-center gap-1 px-1 py-2.5 text-[11px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-5 shrink-0" aria-hidden />
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
