import { Card } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { initials } from "@/shared/lib/initials";
import { formatBRL, formatRelative } from "@/shared/lib/format";
import type { PendingPaymentsListProps } from "./PendingPaymentsList.types";

export function PendingPaymentsList({ items }: PendingPaymentsListProps) {
  if (items.length === 0) {
    return (
      <Card>
        <p className="px-4 text-sm text-muted-foreground">Nenhuma mensalidade em aberto. 🎉</p>
      </Card>
    );
  }

  return (
    <Card className="py-0">
      <ul className="divide-y divide-border">
        {items.map(({ payment, studentName, daysOverdue }) => (
          <li key={payment.id} className="flex items-center gap-3 px-4 py-3">
            <Avatar size="sm">
              <AvatarFallback>{initials(studentName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{studentName}</p>
              <p className="text-xs text-muted-foreground">
                {payment.status === "overdue"
                  ? `Atrasada há ${daysOverdue} dia(s)`
                  : `Vence ${formatRelative(payment.dueDate)}`}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {formatBRL(payment.amountCents)}
              </span>
              <Badge variant={payment.status === "overdue" ? "destructive" : "warning"}>
                {payment.status === "overdue" ? "Atrasada" : "A vencer"}
              </Badge>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
