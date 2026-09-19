const DAY_MS = 86_400_000;

export function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function endOfToday(): number {
  return startOfToday() + DAY_MS - 1;
}

export function isToday(iso: string): boolean {
  const t = new Date(iso).getTime();
  return t >= startOfToday() && t <= endOfToday();
}

export const byStartAsc = (a: { startsAt: string }, b: { startsAt: string }) =>
  new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();

export const byPublishedDesc = (a: { publishedAt: string }, b: { publishedAt: string }) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
