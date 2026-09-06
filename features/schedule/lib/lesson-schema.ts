import * as z from "zod";

export const lessonInputSchema = z.object({
  title: z.string().trim().min(2, "Informe um título").max(120),
  startsAt: z
    .string()
    .trim()
    .refine((v) => v !== "" && !Number.isNaN(Date.parse(v)), "Data e hora inválidas"),
  durationMin: z.number().int().min(15, "Mínimo 15 min").max(240, "Máximo 4 h"),
  mode: z.enum(["in_person", "online"]),
  location: z.string().trim().max(200).nullable(),
  studentId: z.string().nullable(),
});
