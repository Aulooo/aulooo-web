"use client";

import { useActionState, useRef } from "react";
import { Image as ImageIcon, Palette } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { IDLE_ACTION_STATE } from "@/shared/lib/action-state";
import { saveBranding } from "../actions/save-branding";
import { uploadBanner } from "../actions/upload-banner";
import type { ProfessorBranding } from "../types";

/** Identidade visual do professor — banner + cor, só aparece na própria tela de perfil dele. */
export function BrandingCard({ branding }: { branding: ProfessorBranding }) {
  const [colorState, colorAction] = useActionState(saveBranding, IDLE_ACTION_STATE);
  const [bannerState, bannerAction, bannerPending] = useActionState(uploadBanner, IDLE_ACTION_STATE);
  const bannerFormRef = useRef<HTMLFormElement>(null);

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Palette className="size-4 text-muted-foreground" aria-hidden />
          Identidade visual
        </div>

        <div
          className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border bg-muted bg-cover bg-center text-xs text-muted-foreground"
          style={branding.hasBanner ? { backgroundImage: "url(/api/branding/banner)" } : undefined}
        >
          {!branding.hasBanner ? "Sem banner ainda" : null}
        </div>

        <form ref={bannerFormRef} action={bannerAction} className="flex items-center justify-between gap-3">
          <label
            htmlFor="banner-file"
            className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ImageIcon className="size-4" aria-hidden />
            {branding.hasBanner ? "Trocar banner" : "Enviar banner"}
          </label>
          <input
            id="banner-file"
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={bannerPending}
            onChange={() => bannerFormRef.current?.requestSubmit()}
          />
        </form>
        {!bannerState.ok && bannerState.message ? (
          <p className="text-xs text-destructive">{bannerState.message}</p>
        ) : null}

        <form action={colorAction} className="flex items-center justify-between gap-3 border-t border-border pt-3">
          <label htmlFor="brandColor" className="text-sm text-foreground">
            Cor da marca
          </label>
          <input
            id="brandColor"
            type="color"
            name="brandColor"
            defaultValue={branding.brandColor ?? "#2f6fbf"}
            className="h-9 w-16 cursor-pointer rounded border border-border bg-transparent p-0.5"
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
          />
        </form>
        {!colorState.ok && colorState.message ? (
          <p className="text-xs text-destructive">{colorState.message}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
