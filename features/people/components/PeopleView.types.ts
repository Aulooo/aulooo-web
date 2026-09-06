import type { SessionUser } from "@/features/auth";
import type { Person } from "../types";

/** "all" = gestão de pessoas do tenant (admin); "my-students" = carteira do professor. */
export type PeopleScope = "all" | "my-students";

export type PeopleViewProps = {
  people: Person[];
  scope: PeopleScope;
  currentUser: SessionUser;
};
