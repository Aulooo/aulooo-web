"use server";

import { getMyAnnouncements } from "@/features/announcements";
import { getMyRequests } from "@/features/rescheduling";
import type { NotificationItem, NotificationSignal } from "../types";

/**
 * Não existe endpoint de notificação real na API — o sinal é derivado do que já
 * temos: pedidos de reagendamento pendentes (professor) e avisos/decisões novas
 * (aluno). `since` vem do último check do client (guardado em localStorage).
 */
export async function getNotificationSignal(
  role: "professor" | "aluno",
  since: string,
): Promise<NotificationSignal> {
  const sinceTime = new Date(since).getTime();
  const items: NotificationItem[] = [];

  if (role === "professor") {
    const requests = await getMyRequests("professor");
    for (const r of requests) {
      if (/pend/i.test(r.status) && new Date(r.createdAt).getTime() > sinceTime) {
        items.push({
          id: `resched-${r.id}`,
          text: "Novo pedido de reagendamento",
          href: "/reagendamentos",
          at: r.createdAt,
        });
      }
    }
  } else {
    const [announcements, requests] = await Promise.all([
      getMyAnnouncements("aluno"),
      getMyRequests("aluno"),
    ]);

    for (const a of announcements) {
      if (new Date(a.publishedAt).getTime() > sinceTime) {
        items.push({
          id: `ann-${a.id}`,
          text: `Novo aviso: "${a.title}"`,
          href: "/avisos",
          at: a.publishedAt,
        });
      }
    }

    for (const r of requests) {
      if (r.decidedAt && !/pend/i.test(r.status) && new Date(r.decidedAt).getTime() > sinceTime) {
        const approved = /aprov|approv/i.test(r.status);
        items.push({
          id: `resched-${r.id}`,
          text: approved ? "Seu pedido de reagendamento foi aprovado" : "Seu pedido de reagendamento foi recusado",
          href: "/agenda",
          at: r.decidedAt,
        });
      }
    }
  }

  items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return { hasNew: items.length > 0, items: items.slice(0, 8) };
}
