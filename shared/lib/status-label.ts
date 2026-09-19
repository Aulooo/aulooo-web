/** Traduz status crus da API (em inglês) pro rótulo em português exibido na tela. */

const LABELS: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Recusado",
  canceled: "Cancelado",
  cancelled: "Cancelado",
  scheduled: "Agendado",
  done: "Concluído",
  paid: "Pago",
  overdue: "Atrasado",
  expired: "Expirado",
  used: "Usado",
};

/** "active" → "Ativo"; valor desconhecido (já em português, por ex.) volta como veio. */
export function statusLabel(status: string): string {
  return LABELS[status.toLowerCase()] ?? status;
}
