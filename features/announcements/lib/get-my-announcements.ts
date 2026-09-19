import { announcementsApi } from "../api/announcements-api";
import type { Announcement } from "../types";

/**
 * `GET /professors/me/announcements` e `GET /students/me/announcements` já retornam
 * só os Publicados por padrão — não precisa filtrar por status aqui.
 */
export async function getMyAnnouncements(role: "professor" | "aluno"): Promise<Announcement[]> {
  const res = role === "professor" ? await announcementsApi.listAsProfessor() : await announcementsApi.listAsStudent();
  if (res.code !== 1 || !res.data) {
    throw new Error(res.message || "Não foi possível carregar os avisos.");
  }
  return res.data;
}
