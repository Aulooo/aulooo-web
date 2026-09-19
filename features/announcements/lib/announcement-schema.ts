import * as z from "zod";

export const announcementInputSchema = z.object({
  title: z.string().trim().min(3, "Título muito curto").max(120),
  content: z.string().trim().min(3, "Escreva o aviso").max(2000),
  recipientStudentIds: z.array(z.string()).optional(),
});
