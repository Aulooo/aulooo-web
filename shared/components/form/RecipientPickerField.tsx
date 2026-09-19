"use client";

import { useState } from "react";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import type { RecipientPickerFieldProps } from "./RecipientPickerField.types";

const ALL_BROADCAST_VALUE = "__all__";

/**
 * Seleção de um ou mais destinatários (com atalho "Todos"), submetida via
 * FormData em um input hidden — evita depender de comportamento de
 * formulário nativo de checkboxes do Radix. Ver `allMeansBroadcast` nos
 * types pra entender o que "Todos" de fato submete.
 */
export function RecipientPickerField({
  label,
  name,
  options,
  error,
  defaultSelected,
  allMeansBroadcast = false,
  defaultAll = false,
}: RecipientPickerFieldProps) {
  const [all, setAll] = useState(defaultAll);
  const [selected, setSelected] = useState<string[]>(defaultSelected ?? []);

  function toggleAll() {
    setAll((prev) => !prev);
    setSelected([]);
  }

  function toggleOne(value: string) {
    setAll(false);
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  const hiddenValue = all
    ? allMeansBroadcast
      ? ALL_BROADCAST_VALUE
      : options.map((o) => o.value).join(",")
    : selected.join(",");

  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        <span className="text-destructive"> *</span>
      </Label>
      <div
        className="max-h-52 space-y-2 overflow-y-auto rounded-md border border-input p-3"
        aria-invalid={error ? true : undefined}
      >
        {options.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum aluno vinculado.</p>
        ) : (
          <>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Checkbox checked={all} onCheckedChange={toggleAll} />
              Todos os alunos
              {allMeansBroadcast ? (
                <span className="font-normal text-muted-foreground">(inclui quem entrar depois)</span>
              ) : null}
            </label>
            <div className="space-y-2 border-t border-border pt-2">
              {options.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm text-foreground">
                  <Checkbox
                    checked={!all && selected.includes(opt.value)}
                    onCheckedChange={() => toggleOne(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </>
        )}
      </div>
      <input type="hidden" name={name} value={hiddenValue} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
