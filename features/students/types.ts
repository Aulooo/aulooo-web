export type StudentStatus = "active" | "trial" | "inactive";

export type Student = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  email: string;
  phone: string;
  status: StudentStatus;
  /** Plano/pacote contratado (texto livre por ora). */
  plan: string;
  /** Mensalidade em centavos. */
  monthlyFeeCents: number;
  /** Dia de vencimento da mensalidade (1–28). */
  dueDay: number;
  /** Professor responsável (SessionUser.id). */
  teacherId: string;
  joinedAt: string;
};
