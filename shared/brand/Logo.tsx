import Image from "next/image";
import { cn } from "cn";
import type { LogoProps, LogoSize } from "./Logo.types";

const SIDE: Record<LogoSize, number> = { sm: 24, md: 32, lg: 44, xl: 72 };

/**
 * Logo da Aulooo.
 *
 * Fonte: `public/logo-auloo.png` — lockup app-icon (quadrado arredondado azul +
 * wordmark script branco). Se surgir um wordmark horizontal em SVG, troque a
 * `<Image>` mantendo esta API.
 */
export function Logo({
  size = "md",
  className,
  title = "Aulooo",
  priority = false,
}: LogoProps) {
  const side = SIDE[size];

  return (
    <Image
      src="/logo-auloo.png"
      alt={title}
      width={side}
      height={side}
      priority={priority}
      className={cn("shrink-0 select-none rounded-[22%]", className)}
    />
  );
}
