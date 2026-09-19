import * as z from "zod";

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
const timeField = z.string().regex(TIME_REGEX, "Horário inválido");

export const availabilityInputSchema = z
  .object({
    dayOfWeek: z.coerce.number().int().min(0, "Escolha o dia").max(6, "Escolha o dia"),
    startTime: timeField,
    endTime: timeField,
  })
  .refine((v) => v.startTime < v.endTime, { message: "O fim deve ser depois do início", path: ["endTime"] });
