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
};

export type ReschedulingPolicyInput = {
  minimumNoticeHours: number;
  monthlyLimit: number;
};
