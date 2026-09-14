import * as z from "zod";

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
const timeField = z.string().regex(TIME_REGEX, "Horário inválido");

export const createClassInputSchema = z
  .object({
    studentId: z.string().min(1, "Escolha o aluno"),
    date: z.string().min(1, "Escolha a data"),
    startTime: timeField,
    endTime: timeField,
  })
  .refine((v) => v.startTime < v.endTime, { message: "O fim deve ser depois do início", path: ["endTime"] });

export const createSeriesInputSchema = z
  .object({
    studentId: z.string().min(1, "Escolha o aluno"),
    dayOfWeek: z.coerce.number().int().min(0, "Escolha o dia").max(6, "Escolha o dia"),
    startTime: timeField,
    endTime: timeField,
    startDate: z.string().min(1, "Escolha a data inicial"),
    endDate: z.string().min(1, "Escolha a data final"),
  })
  .refine((v) => v.startTime < v.endTime, { message: "O fim deve ser depois do início", path: ["endTime"] })
  .refine((v) => v.startDate <= v.endDate, {
    message: "Deve ser igual ou posterior à data inicial",
    path: ["endDate"],
  });
