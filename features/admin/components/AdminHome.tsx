import type { SessionUser } from "@/features/auth";
import { getProfessors } from "../lib/get-professors";
import { ProfessorInviteCard } from "./ProfessorInviteCard";
import { ProfessorsList } from "./ProfessorsList";

export async function AdminHome({ user }: { user: SessionUser }) {
  const professors = await getProfessors();

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Olá, {user.name.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">Convide professores e gere códigos de aluno pra eles.</p>
      </div>

      <ProfessorInviteCard />

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Professores</h2>
        <ProfessorsList professors={professors} />
      </div>
    </div>
  );
}
