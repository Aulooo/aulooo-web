import { CalendarClock, FileUp, Megaphone, Users, Wallet } from "lucide-react";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { MetricCard } from "@/shared/components/MetricCard";
import { formatBRL } from "@/shared/lib/format";
import { getProfessorHomeData } from "../lib/professor-home";
import { AnnouncementList } from "./AnnouncementList";
import { HomeGreeting } from "./HomeGreeting";
import { LessonList } from "./LessonList";
import { PendingPaymentsList } from "./PendingPaymentsList";
import { QuickActions } from "./QuickActions";
import { SeeAllLink } from "./SeeAllLink";
import type { HomeScreenProps } from "./home-screen-props";

export function ProfessorHome({ user }: HomeScreenProps) {
  const data = getProfessorHomeData(user.id, user.name.split(" ")[0]);

  return (
    <div className="space-y-6">
      <HomeGreeting name={data.firstName} subtitle="Aqui está o seu dia." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Alunos ativos" value={String(data.activeStudents)} icon={Users} />
        <MetricCard label="Aulas hoje" value={String(data.lessonsToday.length)} icon={CalendarClock} />
        <MetricCard label="Recebido no mês" value={formatBRL(data.receivedCents)} icon={Wallet} />
        <MetricCard label="A receber" value={formatBRL(data.toReceiveCents)} icon={Wallet} />
      </div>

      <QuickActions
        actions={[
          { label: "Novo aviso", href: "/avisos", icon: Megaphone },
          { label: "Novo material", href: "/materiais", icon: FileUp },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <section className="space-y-3">
          <SectionHeader title="Hoje" action={<SeeAllLink href="/agenda" label="Ver agenda" />} />
          <LessonList lessons={data.lessonsToday} emptyLabel="Nenhuma aula hoje." />
        </section>

        <section className="space-y-3">
          <SectionHeader
            title="Pagamentos em aberto"
            action={<SeeAllLink href="/financeiro" />}
          />
          <PendingPaymentsList items={data.pendingPayments} />
        </section>

        <section className="space-y-3 lg:col-span-2">
          <SectionHeader title="Avisos recentes" action={<SeeAllLink href="/avisos" />} />
          <AnnouncementList announcements={data.announcements} />
        </section>
      </div>
    </div>
  );
}
