import type { PersonRole } from "../types";

export type RoleCheckboxesProps = {
  value: PersonRole[];
  onChange: (roles: PersonRole[]) => void;
  error?: string;
};
