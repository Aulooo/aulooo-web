/** Formatadores genéricos (sem regra de negócio). */

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Centavos → "R$ 1.234,56". */
export function formatBRL(cents: number): string {
  return BRL.format(cents / 100);
}

/** ISO → "12 de mar." (dia + mês curto). */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

/** ISO → "12/03/2025". */
export function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

/** ISO → "seg., 09:00". */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** ISO → "09:00". */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

/** Diferença relativa curta: "há 2 dias", "em 3 h", "agora". */
export function formatRelative(iso: string, base: Date = new Date()): string {
  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto", style: "short" });
  const diffMs = new Date(iso).getTime() - base.getTime();
  const abs = Math.abs(diffMs);
  const min = 60_000;
  const hour = 60 * min;
  const day = 24 * hour;

  if (abs < hour) return rtf.format(Math.round(diffMs / min), "minute");
  if (abs < day) return rtf.format(Math.round(diffMs / hour), "hour");
  if (abs < 30 * day) return rtf.format(Math.round(diffMs / day), "day");
  return rtf.format(Math.round(diffMs / (30 * day)), "month");
}

/** Bytes → "1,2 MB". */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`;
}
