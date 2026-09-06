import { BadgeCheck, CircleAlert, Clock3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { formatBRL, formatDate, formatRelative } from "@/shared/lib/format";
import { daysOverdue } from "../lib/date-range";
import type { MensalidadeCardProps } from "./MensalidadeCard.types";

type StatusConfig = {
  icon: LucideIcon;
  iconClass: string;
  badgeVariant: "success" | "warning" | "destructive";
  badgeLabel: string;
  line: string;
};

export function MensalidadeCard({ payment }: MensalidadeCardProps) {
  if (!payment) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Mensalidade</span>
          <p className="text-sm text-muted-foreground">Nenhuma cobrança neste mês.</p>
        </CardContent>
      </Card>
    );
  }

  const config: StatusConfig =
    payment.status === "paid"
      ? {
          icon: BadgeCheck,
          iconClass: "text-success",
          badgeVariant: "success",
          badgeLabel: "Em dia",
          line: payment.paidAt ? `Paga ${formatRelative(payment.paidAt)}` : "Pagamento confirmado",
        }
      : payment.status === "pending"
        ? {
            icon: Clock3,
            iconClass: "text-warning",
            badgeVariant: "warning",
            badgeLabel: "A vencer",
            line: `Vence ${formatRelative(payment.dueDate)} · ${formatDate(payment.dueDate)}`,
          }
        : {
            icon: CircleAlert,
            iconClass: "text-destructive",
            badgeVariant: "destructive",
            badgeLabel: "Atrasada",
            line: `Venceu há ${daysOverdue(payment.dueDate)} dia(s)`,
          };

  const Icon = config.icon;

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Icon className={`size-4 ${config.iconClass}`} aria-hidden />
            Mensalidade
          </span>
          <Badge variant={config.badgeVariant}>{config.badgeLabel}</Badge>
        </div>

        <div className="space-y-0.5">
          <p className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            {formatBRL(payment.amountCents)}
          </p>
          <p className="text-sm text-muted-foreground">{config.line}</p>
        </div>

        {payment.status !== "paid" ? (
          <Button
            size="sm"
            variant={payment.status === "overdue" ? "destructive" : "default"}
            className="self-start"
          >
            Ver como pagar
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
