"use client";

import { useState, useTransition } from "react";
import { Check, X } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";
import { formatDateTime } from "@/shared/lib/format";
import { approveSchedulingRequest, rejectSchedulingRequest } from "../actions/decide-scheduling-request";
import type { SchedulingRequestItem } from "../types";

export function SchedulingRequestRow({
  request,
  studentName,
}: {
  request: SchedulingRequestItem;
  studentName: string;
}) {
  const [pending, startTransition] = useTransition();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{studentName}</p>
            <p className="text-xs text-muted-foreground">{formatDateTime(request.requestedInterval.startsAt)}</p>
            {request.reason ? <p className="mt-1 text-xs text-muted-foreground">“{request.reason}”</p> : null}
          </div>
          <Badge variant="warning">Pendente</Badge>
        </div>

        {rejecting ? (
          <div className="space-y-2">
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Motivo da recusa (opcional)"
              rows={2}
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setRejecting(false)} disabled={pending}>
                Voltar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => void (await rejectSchedulingRequest(request.id, reason || undefined)))
                }
              >
                Confirmar recusa
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" disabled={pending} onClick={() => setRejecting(true)}>
              <X />
              Recusar
            </Button>
            <Button
              size="sm"
              disabled={pending}
              onClick={() => startTransition(async () => void (await approveSchedulingRequest(request.id)))}
            >
              <Check />
              Aprovar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
