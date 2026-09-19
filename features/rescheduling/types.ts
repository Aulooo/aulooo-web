export type Interval = {
  startsAt: string;
  endsAt: string;
};

export type ReschedulingRequestItem = {
  id: string;
  classId: string;
  previousInterval: Interval;
  requestedInterval: Interval;
  status: string;
  reason: string | null;
  createdAt: string;
  decidedAt: string | null;
  decisionReason: string | null;
};

export type ReschedulingRequestInput = {
  newDate: string;
  newStartTime: string;
  newEndTime: string;
  reason?: string;
};

export type ReschedulingPolicy = {
  minimumNoticeHours: number;
  monthlyLimit: number;
  /** Sempre 30 no MVP — somente leitura, a API não aceita alterar. */
  windowDays: number;
  timeZone: string;
  /** Desligado por padrão — o professor habilita em "Política de reagendamento". */
  allowStudentSelfScheduling: boolean;
};

export type ReschedulingPolicyInput = {
  minimumNoticeHours: number;
  monthlyLimit: number;
  allowStudentSelfScheduling?: boolean;
};

/** Pedido do aluno por uma aula nova (não existe Aula ainda, diferente de reagendamento). */
export type SchedulingRequestItem = {
  id: string;
  studentId: string;
  requestedInterval: Interval;
  status: string;
  reason: string | null;
  createdAt: string;
  decidedAt: string | null;
  decisionReason: string | null;
  classId: string | null;
};

export type SchedulingRequestInput = {
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm */
  startTime: string;
  /** HH:mm */
  endTime: string;
  reason?: string;
};
