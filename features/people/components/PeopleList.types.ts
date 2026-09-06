import type { Person } from "../types";

export type PeopleListProps = {
  people: Person[];
  onSelect: (person: Person) => void;
};
