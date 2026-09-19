import { brandThemeCss } from "@/shared/lib/brand-theme";

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

/** Sobrescreve --primary/--ring (destaque, "10%" da regra 60/30/10) com a cor de marca do professor. */
export function BrandThemeStyle({ color }: { color: string | null }) {
  if (!color || !HEX_COLOR.test(color)) return null;
  // eslint-disable-next-line react/no-danger -- CSS gerado por nós a partir de um hex já validado, não HTML de terceiros.
  return <style dangerouslySetInnerHTML={{ __html: brandThemeCss(color) }} />;
}
