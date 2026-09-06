"use client";

import { useTransition } from "react";
import { Wallet } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/EmptyState";
import { formatBRL, formatDate, formatRelative } from "@/shared/lib/format";
import { markPaymentPaid } from "../actions/mark-paid";
import type { PagamentosViewProps } from "./PagamentosView.types";

const MONTH_LABEL = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
};

const STATUS: Record<string, { label: string; variant: "success" | "warning" | "destructive" }> = {
  paid: { label: "Pago", variant: "success" },
  pending: { label: "A vencer", variant: "warning" },
  overdue: { label: "Atrasado", variant: "destructive" },
};

export function PagamentosView({ payments }: PagamentosViewProps) {
  const [pending, startTransition] = useTransition();

  const ordered = [...payments].sort(
    (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Pagamentos</h1>
        <p className="text-sm text-muted-foreground">Suas mensalidades.</p>
      </div>

      {ordered.length === 0 ? (
        <EmptyState icon={Wallet} title="Sem cobranças" description="Você não tem mensalidades registradas." />
      ) : (
        <ul className="space-y-3">
          {ordered.map((payment) => {
            const s = STATUS[payment.status];
            return (
              <li key={payment.id}>
                <Card className="gap-2">
                  <div className="flex items-center justify-between gap-2 px-4">
                    <span className="text-sm font-medium text-foreground first-letter:uppercase">
                      {MONTH_LABEL(payment.referenceMonth)}
                    </span>
                    <Badge variant={s.variant}>{s.label}</Badge>
                  </div>
                  <div className="flex items-end justify-between gap-2 px-4">
                    <div>
                      <p className="font-heading text-xl font-semibold text-foreground">
                        {formatBRL(payment.amountCents)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payment.status === "paid"
                          ? payment.paidAt
                            ? `Pago ${formatRelative(payment.paidAt)}`
                            : "Pago"
                          : `Vence ${formatDate(payment.dueDate)}`}
                      </p>
                    </div>
                    {payment.status !== "paid" ? (
                      <Button
                        size="sm"
                        disabled={pending}
                        onClick={() => startTransition(async () => void (await markPaymentPaid(payment.id)))}
                      >
                        Pagar com Pix
                      </Button>
                    ) : null}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
