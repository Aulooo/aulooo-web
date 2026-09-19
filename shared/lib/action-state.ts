/** Formato de retorno das Server Actions, consumido por `useActionState`. */
export type ActionState = {
  ok: boolean;
  message?: string;
  /** Erros por campo, ex: `{ title: "Título muito curto" }`. */
  errors?: Record<string, string>;
  /** Id do recurso criado/editado, quando ok. */
  id?: string;
};

export const IDLE_ACTION_STATE: ActionState = { ok: false };

/** Converte os issues do zod em `{ campo: mensagem }` (primeira mensagem por campo). */
export function zodErrorsToRecord(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.map(String).join(".") || "form";
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
