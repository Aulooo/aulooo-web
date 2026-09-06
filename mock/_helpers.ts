/** Utilitários internos do mock — datas relativas a "agora" para os dados nunca envelhecerem. */

const DAY = 86_400_000;
const NOW = Date.now();

/** ISO a `days` dias de agora (negativo = passado). `hour` fixa a hora do dia. */
export function isoIn(days: number, hour?: number): string {
  const d = new Date(NOW + days * DAY);
  if (hour !== undefined) d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

/** Competência YYYY-MM com `offset` meses (0 = mês atual, -1 = mês passado). */
export function monthKey(offset = 0): string {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Data de vencimento (dia `day`) no mês com `offset` meses. */
export function dueDate(day: number, offset = 0): string {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + offset);
  d.setDate(day);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}
