import type { Role } from "@/features/auth";

/** Limpa a marca de "tour já visto" e recarrega — o TourGuide reinicia do zero. */
export function restartTour(role: Role, userId: string) {
  localStorage.removeItem(`aulooo_tour_done_${role}_${userId}`);
  window.location.assign("/home");
}
