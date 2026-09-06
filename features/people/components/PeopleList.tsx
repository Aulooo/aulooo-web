import { Users } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/EmptyState";
import { PersonRow } from "./PersonRow";
import type { PeopleListProps } from "./PeopleList.types";

export function PeopleList({ people, onSelect }: PeopleListProps) {
  if (people.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Nenhuma pessoa ainda"
        description="Cadastre professores e alunos do Studio Alves."
      />
    );
  }

  const sorted = [...people].sort((a, b) => {
    if (a.status !== b.status) return a.status === "active" ? -1 : 1;
    return a.name.localeCompare(b.name, "pt-BR");
  });

  return (
    <Card className="py-0">
      <ul className="divide-y divide-border">
        {sorted.map((person) => (
          <li key={person.id}>
            <PersonRow person={person} onSelect={() => onSelect(person)} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
