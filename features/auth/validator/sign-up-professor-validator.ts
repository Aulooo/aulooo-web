import * as z from "zod";

const onlyDigits = (v: string) => v.replace(/\D/g, "");
const optionalText = z.string().trim().optional().or(z.literal(""));

export const signUpProfessorSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(160),
  cpf: z
    .string()
    .trim()
    .transform(onlyDigits)
    .refine((v) => v.length === 11, "CPF deve ter 11 dígitos"),
  email: z.string().trim().min(5, "E-mail inválido").max(255).email("E-mail inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres").max(255),
  phone: optionalText,
  dateOfBirth: optionalText,
  professionalRegistration: z.string().trim().min(1, "Obrigatório").max(60),
  professionalDescription: optionalText,
});
