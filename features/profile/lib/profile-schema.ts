import * as z from "zod";

export const profileInputSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(120),
  phone: z.string().trim().min(8, "Telefone inválido").max(20),
  specialty: z.string().trim().max(120),
});
