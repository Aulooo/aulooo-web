import * as z from "zod";

const emailField = z.string().trim().min(5, "E-mail inválido").max(255).email("E-mail inválido");
const phoneField = z.string().trim().max(20).optional().or(z.literal(""));
const dateOfBirthField = z.string().trim().optional().or(z.literal(""));

export const professorProfileInputSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(160),
  email: emailField,
  phone: phoneField,
  dateOfBirth: dateOfBirthField,
  professionalRegistration: z.string().trim().min(1, "Obrigatório").max(60),
  professionalDescription: z.string().trim().max(500).optional().or(z.literal("")),
});

export const studentProfileInputSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(160),
  email: emailField,
  phone: phoneField,
  dateOfBirth: dateOfBirthField,
  objective: z.string().trim().max(500).optional().or(z.literal("")),
});
