"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { formatRelative } from "@/shared/lib/format";
import { getNotificationSignal } from "../actions/get-signal";
import type { NotificationItem } from "../types";

type NotifiableRole = "professor" | "aluno";

const POLL_MS = 5000;
const SINCE_KEY = "aulooo_notif_since";

/**
 * Não existe endpoint de notificação real — o sino consulta a cada 5s um sinal
 * derivado (avisos novos / decisões de reagendamento pro aluno, pedidos
 * pendentes pro professor) e compara com o último check salvo localmente.
 */
export function NotificationBell({ role }: { role: NotifiableRole }) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [hasNew, setHasNew] = useState(false);
  const sinceRef = useRef<string | null>(null);

  useEffect(() => {
    if (sinceRef.current === null) {
      sinceRef.current = localStorage.getItem(SINCE_KEY) ?? new Date().toISOString();
      localStorage.setItem(SINCE_KEY, sinceRef.current);
    }

    let cancelled = false;

    async function poll() {
      const signal = await getNotificationSignal(role, sinceRef.current!);
      if (cancelled) return;
      if (signal.items.length > 0) setItems(signal.items);
      setHasNew(signal.hasNew);
    }

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [role]);

  function handleOpenChange(open: boolean) {
    if (open && hasNew) {
      const now = new Date().toISOString();
      sinceRef.current = now;
      localStorage.setItem(SINCE_KEY, now);
      setHasNew(false);
    }
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notificações" className="relative">
          <Bell />
          {hasNew ? (
            <span
              className="absolute top-1.5 right-1.5 size-2 rounded-full bg-brand-warm ring-2 ring-card"
              aria-hidden
            />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <p className="px-2 py-3 text-center text-sm text-muted-foreground">Nada por aqui ainda.</p>
        ) : (
          items.map((item) => (
            <DropdownMenuItem key={item.id} asChild>
              <Link href={item.href} className="flex flex-col items-start gap-0.5">
                <span className="text-sm">{item.text}</span>
                <span className="text-xs text-muted-foreground">{formatRelative(item.at)}</span>
              </Link>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
