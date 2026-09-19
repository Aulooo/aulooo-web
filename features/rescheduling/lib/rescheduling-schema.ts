import * as z from "zod";

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
const timeField = z.string().regex(TIME_REGEX, "Horário inválido");

export const reschedulingRequestSchema = z
  .object({
    newDate: z.string().min(1, "Escolha a data"),
    newStartTime: timeField,
    newEndTime: timeField,
    reason: z.string().trim().max(500).optional().or(z.literal("")),
  })
  .refine((v) => v.newStartTime < v.newEndTime, {
    message: "O fim deve ser depois do início",
    path: ["newEndTime"],
  });

export const policyInputSchema = z.object({
  minimumNoticeHours: z.coerce.number().int().min(0, "Não pode ser negativo"),
  monthlyLimit: z.coerce.number().int().min(0, "Não pode ser negativo"),
  allowStudentSelfScheduling: z.boolean().optional(),
});

export const schedulingRequestSchema = z
  .object({
    date: z.string().min(1, "Escolha a data"),
    startTime: timeField,
    endTime: timeField,
    reason: z.string().trim().max(500).optional().or(z.literal("")),
  })
  .refine((v) => v.startTime < v.endTime, {
    message: "O fim deve ser depois do início",
    path: ["endTime"],
  });
