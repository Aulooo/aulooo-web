"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import type { FormSheetProps } from "./FormSheet.types";

/**
 * Casca padrão de formulário num Sheet lateral: header + corpo rolável + footer
 * (Cancelar / submit). Monte só os campos como `children`.
 * Renderize condicionalmente (só quando aberto) — usa `open` fixo.
 */
export function FormSheet({
  title,
  description,
  submitLabel,
  pending,
  formAction,
  error,
  onClose,
  children,
}: FormSheetProps) {
  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>

        <form action={formAction} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto p-4">
            {children}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>

          <SheetFooter className="flex-row border-t border-border">
            <SheetClose asChild>
              <Button type="button" variant="secondary" className="h-11 flex-1">
                Cancelar
              </Button>
            </SheetClose>
            <Button type="submit" disabled={pending} className="h-11 flex-1">
              {pending ? "Salvando…" : submitLabel}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
