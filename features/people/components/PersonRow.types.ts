import type { Person } from "../types";

export type PersonRowProps = {
  person: Person;
  onSelect: () => void;
};
