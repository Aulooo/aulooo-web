import type { Availability } from "../types";

export type AvailabilityFormSheetProps = {
  availability: Availability | null;
  onClose: () => void;
};
