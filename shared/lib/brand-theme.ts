/** Utilidades de cor puras (sem HTTP, sem regra de negócio) para tema de marca. */

type Hsl = { h: number; s: number; l: number };

function hexToHsl(hex: string): Hsl {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: h * 60, s: s * 100, l: l * 100 };
}

function hslToHex({ h, s, l }: Hsl): string {
  const sN = s / 100;
  const lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lN - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Preto ou branco — o que der mais contraste em cima da cor (luminância relativa, WCAG). */
function readableForeground(hex: string): string {
  const clean = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16) / 255);
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return luminance > 0.5 ? "#141414" : "#ffffff";
}

type BrandThemeVars = Record<string, string>;

/**
 * Deriva as variáveis de tema a partir da cor escolhida pelo professor, uma
 * versão pro tema claro e uma pro escuro.
 *
 * Só mexe no destaque (--primary/--ring/--sidebar-primary — o "10%" da regra
 * 60/30/10): fundo, cards e bordas (os 60%+30% neutros da identidade Aulooo)
 * continuam intocados, garantindo legibilidade e coesão visual não importa
 * qual matiz o professor escolher. A luminosidade é sempre recalculada (não
 * usa a cor crua) pra manter contraste mínimo contra o fundo do tema.
 */
export function deriveBrandTheme(brandColorHex: string): { light: BrandThemeVars; dark: BrandThemeVars } {
  const hsl = hexToHsl(brandColorHex);

  const lightPrimary = hslToHex({ h: hsl.h, s: clamp(hsl.s, 35, 90), l: clamp(hsl.l, 32, 55) });
  const darkPrimary = hslToHex({ h: hsl.h, s: clamp(hsl.s, 35, 85), l: clamp(hsl.l, 55, 72) });

  const lightForeground = readableForeground(lightPrimary);
  const darkForeground = readableForeground(darkPrimary);

  return {
    light: {
      "--primary": lightPrimary,
      "--primary-foreground": lightForeground,
      "--ring": lightPrimary,
      "--sidebar-primary": lightPrimary,
      "--sidebar-primary-foreground": lightForeground,
      "--sidebar-ring": lightPrimary,
    },
    dark: {
      "--primary": darkPrimary,
      "--primary-foreground": darkForeground,
      "--ring": darkPrimary,
      "--sidebar-primary": darkPrimary,
      "--sidebar-primary-foreground": darkForeground,
      "--sidebar-ring": darkPrimary,
    },
  };
}

/** CSS pronto pra injetar em uma tag <style>. */
export function brandThemeCss(brandColorHex: string): string {
  const { light, dark } = deriveBrandTheme(brandColorHex);
  const decls = (vars: BrandThemeVars) =>
    Object.entries(vars)
      .map(([k, v]) => `${k}:${v}`)
      .join(";");
  return `:root{${decls(light)}}.dark{${decls(dark)}}`;
}
