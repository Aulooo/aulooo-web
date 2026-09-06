import * as z from "zod";

export const documentInputSchema = z
  .object({
    title: z.string().trim().min(2, "Informe um título").max(120),
    kind: z.enum(["pdf", "video", "image", "sheet", "doc", "link"]),
    url: z.string().trim().min(1, "Cole o link do material").max(1000),
    audience: z.enum(["all", "student"]),
    studentId: z.string().nullable(),
  })
  .superRefine((value, ctx) => {
    if (value.audience === "student" && !value.studentId) {
      ctx.addIssue({ code: "custom", message: "Escolha o aluno", path: ["studentId"] });
    }
  });
