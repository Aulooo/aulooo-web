"use client";

import { useCallback, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { PeopleList } from "./PeopleList";
import { PersonDetailSheet } from "./PersonDetailSheet";
import { PersonFormSheet } from "./PersonFormSheet";
import type { Person } from "../types";
import type { PeopleViewProps } from "./PeopleView.types";

type SheetState =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "detail"; person: Person }
  | { kind: "edit"; person: Person };

export function PeopleView({ people }: PeopleViewProps) {
  const [sheet, setSheet] = useState<SheetState>({ kind: "closed" });

  const professors = useMemo(
    () =>
      people
        .filter((p) => p.roles.includes("professor"))
        .map((p) => ({ id: p.id, name: p.name })),
    [people],
  );
  const professorNameById = useMemo(
    () => Object.fromEntries(professors.map((p) => [p.id, p.name])),
    [professors],
  );

  const activeCount = people.filter((p) => p.status === "active").length;
  const close = useCallback(() => setSheet({ kind: "closed" }), []);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Pessoas</h1>
          <p className="text-sm text-muted-foreground">
            {activeCount} ativa{activeCount === 1 ? "" : "s"} · {people.length} no total
          </p>
        </div>
        <Button className="h-10 shrink-0" onClick={() => setSheet({ kind: "create" })}>
          <Plus />
          Nova pessoa
        </Button>
      </div>

      <PeopleList people={people} onSelect={(person) => setSheet({ kind: "detail", person })} />

      {sheet.kind === "create" || sheet.kind === "edit" ? (
        <PersonFormSheet
          person={sheet.kind === "edit" ? sheet.person : null}
          professors={professors}
          onClose={close}
        />
      ) : null}

      {sheet.kind === "detail" ? (
        <PersonDetailSheet
          person={sheet.person}
          professorNameById={professorNameById}
          onClose={close}
          onEdit={(person) => setSheet({ kind: "edit", person })}
        />
      ) : null}
    </div>
  );
}
