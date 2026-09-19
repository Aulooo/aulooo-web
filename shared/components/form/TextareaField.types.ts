import type { ComponentProps } from "react";

export type TextareaFieldProps = Omit<ComponentProps<"textarea">, "name"> & {
  label: string;
  name: string;
  error?: string;
};
