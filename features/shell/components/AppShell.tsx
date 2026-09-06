import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";
import type { AppShellProps } from "./AppShell.types";

/**
 * Casca da aplicação autenticada.
 * - Mobile: header fixo no topo + conteúdo rolável + bottom nav fixo.
 * - Desktop (`md+`): sidebar fixa à esquerda + conteúdo (header e bottom nav somem).
 */
export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh w-full overflow-x-hidden bg-background">
      <Sidebar user={user} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader user={user} />
        <main className="mx-auto w-full min-w-0 max-w-lg flex-1 px-4 py-5 md:max-w-4xl md:px-8 md:py-8">
          {children}
        </main>
        <BottomNav role={user.role} />
      </div>
    </div>
  );
}
