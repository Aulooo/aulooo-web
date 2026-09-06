import { GraduationCap, Users, Wallet } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { MetricCard } from "@/shared/components/MetricCard";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { formatBRL } from "@/shared/lib/format";
import type { RelatoriosViewProps } from "./RelatoriosView.types";

const pct = (part: number, total: number) => (total === 0 ? 0 : Math.round((part / total) * 100));

export function RelatoriosView({ report, monthLabel }: RelatoriosViewProps) {
  const { paymentBreakdown: pb } = report;
  const totalPayments = pb.paid + pb.pending + pb.overdue;
  const collectRate = pct(report.revenueCents, report.billedCents);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Relatórios</h1>
        <p className="text-sm text-muted-foreground first-letter:uppercase">{monthLabel}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Alunos ativos" value={String(report.activeStudents)} icon={Users} />
        <MetricCard label="Professores" value={String(report.activeTeachers)} icon={GraduationCap} />
        <MetricCard label="Receita do mês" value={formatBRL(report.revenueCents)} icon={Wallet} />
        <MetricCard label="Taxa de recebimento" value={`${collectRate}%`} icon={Wallet} />
      </div>

      <section className="space-y-3">
        <SectionHeader title="Mensalidades do mês" />
        <Card>
          <CardContent className="space-y-3">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
              <span className="bg-success" style={{ width: `${pct(pb.paid, totalPayments)}%` }} />
              <span className="bg-warning" style={{ width: `${pct(pb.pending, totalPayments)}%` }} />
              <span className="bg-destructive" style={{ width: `${pct(pb.overdue, totalPayments)}%` }} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span><span className="mr-1 inline-block size-2 rounded-full bg-success align-middle" />Pagas {pb.paid}</span>
              <span><span className="mr-1 inline-block size-2 rounded-full bg-warning align-middle" />A vencer {pb.pending}</span>
              <span><span className="mr-1 inline-block size-2 rounded-full bg-destructive align-middle" />Atrasadas {pb.overdue}</span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <SectionHeader title="Alunos por professor" />
        <Card className="py-0">
          <ul className="divide-y divide-border">
            {report.studentsByTeacher.map((t) => (
              <li key={t.teacherName} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-foreground">{t.teacherName}</span>
                <span className="font-medium tabular-nums text-muted-foreground">{t.count}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
