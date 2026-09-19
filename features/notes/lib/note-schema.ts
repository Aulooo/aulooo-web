import * as z from "zod";

export const noteInputSchema = z.object({
  content: z.string().trim().min(1, "Escreva a observação").max(2000),
});
