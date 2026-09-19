export type LogoSize = "sm" | "md" | "lg" | "xl";

export type LogoProps = {
  /** Lado do símbolo. sm = 24px, md = 32px, lg = 44px, xl = 72px. */
  size?: LogoSize;
  className?: string;
  /** Texto acessível. */
  title?: string;
  /** Prioriza o carregamento (use no header/above the fold). */
  priority?: boolean;
};
