import Link from "next/link";

/** Ação padrão do SectionHeader nas homes. */
export function SeeAllLink({ href, label = "Ver todos" }: { href: string; label?: string }) {
  return (
    <Link href={href} className="text-xs font-medium text-primary hover:underline">
      {label}
    </Link>
  );
}
