export type SelectOption = { value: string; label: string };

export type SelectFieldProps = {
  label: string;
  name: string;
  options: SelectOption[];
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
};
