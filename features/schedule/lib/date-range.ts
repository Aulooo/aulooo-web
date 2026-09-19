/**
 * Janela padrão da tela de agenda. `GET /professors|students/me/classes` rejeita
 * intervalos maiores que ~31 dias (VALIDATION_ERROR "Período de consulta inválido"),
 * então ficamos bem abaixo disso: 3 dias atrás até 27 à frente (30 dias no total).
 */
export function defaultAgendaRange(): { from: string; to: string } {
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const from = new Date();
  from.setDate(from.getDate() - 3);
  const to = new Date();
  to.setDate(to.getDate() + 27);
  return { from: iso(from), to: iso(to) };
}
