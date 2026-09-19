/**
 * 0 = domingo … 6 = sábado (convenção de `Date#getDay()`). O exemplo do contrato
 * mostra `"Tuesday"` como string, mas a API real só aceita o índice numérico —
 * confirmado testando contra o backend local.
 */
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Uma ocorrência de aula (avulsa ou materializada de uma série). */
export type LessonClass = {
  id: string;
  studentId: string | null;
  seriesId: string | null;
  startsAt: string;
  endsAt: string;
  status: string;
  cancellationReason?: string | null;
};

export type CreateClassInput = {
  studentId: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm */
  startTime: string;
  /** HH:mm */
  endTime: string;
};

export type CreateSeriesInput = {
  studentId: string;
  /** 0-6, ver `WeekDay`. */
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
};
