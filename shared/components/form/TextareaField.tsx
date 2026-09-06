import { cn } from "cn";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import type { TextareaFieldProps } from "./TextareaField.types";

export function TextareaField({ label, name, error, className, required, ...props }: TextareaFieldProps) {
  const id = `field-${name}`;
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Textarea id={id} name={name} required={required} aria-invalid={error ? true : undefined} {...props} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
