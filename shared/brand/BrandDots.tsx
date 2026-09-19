import { cn } from "cn";

/**
 * Motivo dos três "o" da Aulooo — assinatura discreta.
 * Um preenchido na cor de marca, um no acento quente, um em contorno.
 */
export function BrandDots({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 46 16"
      className={cn("h-3 w-auto", className)}
      fill="none"
      aria-hidden
    >
      <circle cx="8" cy="8" r="6" fill="var(--brand)" />
      <circle cx="23" cy="8" r="6" fill="var(--brand-warm)" />
      <circle cx="38" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground" />
    </svg>
  );
}
