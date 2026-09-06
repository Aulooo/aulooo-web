"use client";

import { useTransition } from "react";
import { CircleAlert, Clock3, Wallet } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { MetricCard } from "@/shared/components/MetricCard";
import { EmptyState } from "@/shared/components/EmptyState";
import { initials } from "@/shared/lib/initials";
import { formatBRL, formatDate, formatRelative } from "@/shared/lib/format";
import { markPaymentPaid } from "../actions/mark-paid";
import type { FinanceiroViewProps } from "./FinanceiroView.types";

const STATUS: Record<string, { label: string; variant: "success" | "warning" | "destructive" }> = {
  paid: { label: "Pago", variant: "success" },
  pending: { label: "A vencer", variant: "warning" },
  overdue: { label: "Atrasado", variant: "destructive" },
};

export function FinanceiroView({
  rows,
  receivedCents,
  toReceiveCents,
  overdueCents,
}: FinanceiroViewProps) {
  const [pending, startTransition] = useTransition();

  const ordered = [...rows].sort((a, b) => {
    const rank = (s: string) => (s === "overdue" ? 0 : s === "pending" ? 1 : 2);
    return rank(a.payment.status) - rank(b.payment.status);
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Financeiro</h1>
        <p className="text-sm text-muted-foreground">Mensalidades do mês.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <MetricCard label="Recebido no mês" value={formatBRL(receivedCents)} icon={Wallet} />
        <MetricCard label="A receber" value={formatBRL(toReceiveCents)} icon={Clock3} />
        <MetricCard label="Atrasado" value={formatBRL(overdueCents)} icon={CircleAlert} />
      </div>

      {ordered.length === 0 ? (
        <EmptyState icon={Wallet} title="Sem cobranças" description="Nenhuma mensalidade neste mês." />
      ) : (
        <Card className="py-0">
          <ul className="divide-y divide-border">
            {ordered.map(({ payment, studentName }) => {
              const s = STATUS[payment.status];
              return (
                <li key={payment.id} className="flex items-center gap-3 px-4 py-3">
                  <Avatar size="sm">
                    <AvatarFallback>{initials(studentName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{studentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {payment.status === "paid"
                        ? payment.paidAt
                          ? `Pago ${formatRelative(payment.paidAt)}`
                          : "Pago"
                        : `Vence ${formatDate(payment.dueDate)}`}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                    {formatBRL(payment.amountCents)}
                  </span>
                  {payment.status === "paid" ? (
                    <Badge variant={s.variant}>{s.label}</Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={pending}
                      onClick={() => startTransition(async () => void (await markPaymentPaid(payment.id)))}
                    >
                      Marcar pago
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
