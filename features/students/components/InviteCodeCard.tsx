"use client";

import { useState, useTransition } from "react";
import { Check, Copy, KeyRound } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatRelative } from "@/shared/lib/format";
import { generateEntryCode } from "../actions/generate-entry-code";
import type { GenerateEntryCodeState } from "../actions/generate-entry-code";

/** Gera o código de convite (30 min) + link e QR prontos pra compartilhar. */
export function InviteCodeCard() {
  const [pending, startTransition] = useTransition();
  const [entryCode, setEntryCode] = useState<GenerateEntryCodeState | null>(null);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  function handleGenerateCode() {
    startTransition(async () => {
      setCopied(null);
      const result = await generateEntryCode();
      setEntryCode(result);
    });
  }

  function signUpLink(code: string): string {
    return `${window.location.origin}/sign-up/student?code=${code}`;
  }

  function handleCopy(what: "code" | "link") {
    if (!entryCode?.code) return;
    const text = what === "code" ? entryCode.code : signUpLink(entryCode.code);
    navigator.clipboard?.writeText(text).then(() => setCopied(what));
  }

  return (
    <Card data-tour="invite-card">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <KeyRound className="size-4 text-muted-foreground" aria-hidden />
            Convidar aluno
          </div>
          <Button variant="secondary" size="sm" onClick={handleGenerateCode} disabled={pending}>
            Gerar código
          </Button>
        </div>

        {entryCode?.ok && entryCode.code ? (
          <div className="flex gap-3 rounded-lg bg-muted p-3">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-md bg-white p-1.5">
              <QRCodeSVG value={signUpLink(entryCode.code)} size={72} />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="font-heading text-lg font-semibold tracking-widest text-foreground">
                  {entryCode.code}
                </p>
                <Button variant="ghost" size="icon-sm" aria-label="Copiar código" onClick={() => handleCopy("code")}>
                  {copied === "code" ? <Check className="text-success" /> : <Copy />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {entryCode.expiresAt ? `Expira ${formatRelative(entryCode.expiresAt)}` : null}
              </p>
              <div className="flex items-center justify-between gap-2 border-t border-border pt-2">
                <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{signUpLink(entryCode.code)}</p>
                <Button variant="ghost" size="icon-sm" aria-label="Copiar link" onClick={() => handleCopy("link")}>
                  {copied === "link" ? <Check className="text-success" /> : <Copy />}
                </Button>
              </div>
            </div>
          </div>
        ) : entryCode && !entryCode.ok ? (
          <p className="text-sm text-destructive">{entryCode.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Gere um código (ou QR) pra compartilhar com o aluno — vale por 30 minutos.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
