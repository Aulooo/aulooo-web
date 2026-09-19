import type { ComponentProps, ReactNode } from "react";

export type FieldProps = Omit<ComponentProps<"input">, "name"> & {
  label: string;
  name: string;
  error?: string;
  hint?: ReactNode;
};
