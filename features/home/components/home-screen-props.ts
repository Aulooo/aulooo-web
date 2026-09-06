import type { SessionUser } from "@/features/auth";

/** Prop compartilhada pelas telas de home (todas recebem a sessão resolvida). */
export type HomeScreenProps = {
  user: SessionUser;
};
