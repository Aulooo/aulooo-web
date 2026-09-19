/** Força o tour a rodar de novo, mesmo já concluído no perfil. */
export function restartTour() {
  window.location.assign("/home?tour=1");
}
