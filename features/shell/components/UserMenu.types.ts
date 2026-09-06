import type { SessionUser } from "@/features/auth";

export type UserMenuProps = {
  user: SessionUser;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
};
