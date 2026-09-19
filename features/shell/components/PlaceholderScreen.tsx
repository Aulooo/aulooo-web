import { Hammer } from "lucide-react";
import { BrandDots } from "@/shared/brand/BrandDots";
import { EmptyState } from "@/shared/components/EmptyState";
import type { PlaceholderScreenProps } from "./PlaceholderScreen.types";

/** Tela stub para rotas de módulos que ainda não foram construídos. */
export function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <BrandDots />
      </div>
      <EmptyState
        icon={Hammer}
        title="Em construção"
        description={description ?? "Este módulo entra em um tópico seguinte do plano."}
      />
    </div>
  );
}
