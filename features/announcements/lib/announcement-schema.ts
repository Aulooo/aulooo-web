import * as z from "zod";

export const announcementInputSchema = z
  .object({
    title: z.string().trim().min(3, "Título muito curto").max(120),
    body: z.string().trim().min(3, "Escreva o aviso").max(2000),
    audience: z.enum(["all", "student"]),
    studentId: z.string().nullable(),
    pinned: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (value.audience === "student" && !value.studentId) {
      ctx.addIssue({ code: "custom", message: "Escolha o aluno", path: ["studentId"] });
    }
  });
