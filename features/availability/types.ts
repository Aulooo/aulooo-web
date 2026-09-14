export type Availability = {
  id: string;
  /** 0 = domingo … 6 = sábado. */
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  status: string;
  timeZone: string;
};

export type AvailabilityInput = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};
