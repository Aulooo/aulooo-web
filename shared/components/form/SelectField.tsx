"use client";

import { cn } from "cn";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { SelectFieldProps } from "./SelectField.types";

/** Select do design system que submete via FormData (usa o `name` do Radix). */
export function SelectField({
  label,
  name,
  options,
  defaultValue,
  placeholder = "Selecione",
  error,
  required,
  className,
}: SelectFieldProps) {
  const id = `field-${name}`;
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Select name={name} defaultValue={defaultValue || undefined} required={required}>
        <SelectTrigger id={id} aria-invalid={error ? true : undefined} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
