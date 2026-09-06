import Link from "next/link";
import { BarChart3, CircleAlert, GraduationCap, User, Users, Wallet } from "lucide-react";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { MetricCard } from "@/shared/components/MetricCard";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatBRL } from "@/shared/lib/format";
import { getAdminHomeData } from "../lib/admin-home";
import { ActivityFeed } from "./ActivityFeed";
import { HomeGreeting } from "./HomeGreeting";
import { QuickActions } from "./QuickActions";
import type { HomeScreenProps } from "./home-screen-props";

export function AdminHome({ user }: HomeScreenProps) {
  const data = getAdminHomeData(user.name.split(" ")[0], user.tenantName);

  return (
    <div className="space-y-6">
      <HomeGreeting name={data.firstName} subtitle={data.tenantName} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Alunos ativos" value={String(data.activeStudents)} icon={Users} />
        <MetricCard label="Professores" value={String(data.activeTeachers)} icon={GraduationCap} />
        <MetricCard label="Receita do mês" value={formatBRL(data.revenueCents)} icon={Wallet} />
        <MetricCard label="Inadimplência" value={formatBRL(data.overdueCents)} icon={CircleAlert} />
      </div>

      {data.overdueCount > 0 ? (
        <Card>
          <CardContent className="flex items-center gap-3">
            <CircleAlert className="size-5 shrink-0 text-destructive" aria-hidden />
            <p className="min-w-0 flex-1 text-sm text-foreground">
              {data.overdueCount} mensalidade(s) atrasada(s) neste mês.
            </p>
            <Link href="/financeiro" className="shrink-0 text-xs font-medium text-primary hover:underline">
              Ver
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <QuickActions
        actions={[
          { label: "Pessoas", href: "/usuarios", icon: Users },
          { label: "Financeiro", href: "/financeiro", icon: Wallet },
          { label: "Relatórios", href: "/relatorios", icon: BarChart3 },
          { label: "Perfil", href: "/perfil", icon: User },
        ]}
      />

      <section className="space-y-3">
        <SectionHeader title="Atividade recente" />
        <ActivityFeed items={data.activity} />
      </section>
    </div>
  );
}
