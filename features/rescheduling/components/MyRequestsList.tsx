import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { formatDateTime } from "@/shared/lib/format";
import type { ReschedulingRequestItem } from "../types";

function badgeVariant(status: string): "warning" | "success" | "destructive" | "secondary" {
  if (/pend/i.test(status)) return "warning";
  if (/aprov|approv/i.test(status)) return "success";
  if (/recus|reject/i.test(status)) return "destructive";
  return "secondary";
}

export function MyRequestsList({ requests }: { requests: ReschedulingRequestItem[] }) {
  if (requests.length === 0) return null;

  const sorted = [...requests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">Solicitações de reagendamento</h2>
      <Card className="py-0">
        <ul className="divide-y divide-border">
          {sorted.map((r) => (
            <li key={r.id} className="space-y-1 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">
                  {formatDateTime(r.previousInterval.startsAt)} → {formatDateTime(r.requestedInterval.startsAt)}
                </p>
                <Badge variant={badgeVariant(r.status)}>{r.status}</Badge>
              </div>
              {r.decisionReason ? (
                <p className="text-xs text-muted-foreground">Motivo do professor: {r.decisionReason}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
