import { CalendarClock, CalendarPlus } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/EmptyState";
import { formatDateTime } from "@/shared/lib/format";
import { statusLabel } from "@/shared/lib/status-label";
import { PolicyCard } from "./PolicyCard";
import { RescheduleRequestRow } from "./RescheduleRequestRow";
import { SchedulingRequestRow } from "./SchedulingRequestRow";
import type { ReschedulingPolicy, ReschedulingRequestItem, SchedulingRequestItem } from "../types";

export type RequestWithStudent = { request: ReschedulingRequestItem; studentName: string };
export type SchedulingRequestWithStudent = { request: SchedulingRequestItem; studentName: string };

const isPending = (r: ReschedulingRequestItem | SchedulingRequestItem) => /pend/i.test(r.status);

export function ReschedulingRequestsView({
  items,
  schedulingRequests,
  policy,
}: {
  items: RequestWithStudent[];
  schedulingRequests: SchedulingRequestWithStudent[];
  policy: ReschedulingPolicy;
}) {
  const pending = items.filter((i) => isPending(i.request));
  const decided = items
    .filter((i) => !isPending(i.request))
    .sort((a, b) => new Date(b.request.createdAt).getTime() - new Date(a.request.createdAt).getTime())
    .slice(0, 10);

  const pendingNewClass = schedulingRequests.filter((i) => isPending(i.request));
  const decidedNewClass = schedulingRequests
    .filter((i) => !isPending(i.request))
    .sort((a, b) => new Date(b.request.createdAt).getTime() - new Date(a.request.createdAt).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Reagendamentos</h1>
        <p className="text-sm text-muted-foreground">Pedidos dos seus alunos pra mudar o horário de uma aula.</p>
      </div>

      <PolicyCard policy={policy} />

      {policy.allowStudentSelfScheduling || schedulingRequests.length > 0 ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarPlus className="size-4 text-muted-foreground" aria-hidden />
            Pedidos de aula nova
          </h2>
          {pendingNewClass.length === 0 ? (
            <EmptyState
              icon={CalendarPlus}
              title="Nenhum pedido pendente"
              description="Quando um aluno pedir uma aula nova, aparece aqui."
            />
          ) : (
            <div className="space-y-3">
              {pendingNewClass.map(({ request, studentName }) => (
                <SchedulingRequestRow key={request.id} request={request} studentName={studentName} />
              ))}
            </div>
          )}

          {decidedNewClass.length > 0 ? (
            <Card className="py-0">
              <ul className="divide-y divide-border">
                {decidedNewClass.map(({ request, studentName }) => (
                  <li key={request.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(request.requestedInterval.startsAt)}
                      </p>
                    </div>
                    <Badge variant={/aprov|approv/i.test(request.status) ? "success" : "secondary"}>
                      {statusLabel(request.status)}
                    </Badge>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Pendentes</h2>
        {pending.length === 0 ? (
          <EmptyState icon={CalendarClock} title="Nenhum pedido pendente" description="Quando um aluno pedir, aparece aqui." />
        ) : (
          <div className="space-y-3">
            {pending.map(({ request, studentName }) => (
              <RescheduleRequestRow key={request.id} request={request} studentName={studentName} />
            ))}
          </div>
        )}
      </section>

      {decided.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Histórico recente</h2>
          <Card className="py-0">
            <ul className="divide-y divide-border">
              {decided.map(({ request, studentName }) => (
                <li key={request.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{studentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(request.requestedInterval.startsAt)}
                    </p>
                  </div>
                  <Badge variant={/aprov|approv/i.test(request.status) ? "success" : "secondary"}>
                    {statusLabel(request.status)}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
