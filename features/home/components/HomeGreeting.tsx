import type { HomeGreetingProps } from "./HomeGreeting.types";

export function HomeGreeting({ name, subtitle }: HomeGreetingProps) {
  return (
    <div className="space-y-0.5">
      <h1 className="text-xl font-semibold tracking-tight text-foreground">Olá, {name}</h1>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
