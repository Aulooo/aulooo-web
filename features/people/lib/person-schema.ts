import * as z from "zod";

export const personRoleSchema = z.enum(["admin", "professor", "aluno"]);

export const studentProfileSchema = z.object({
  plan: z.string().trim().min(1, "Informe o plano"),
  monthlyFeeCents: z.number().int("Valor inválido").nonnegative("Valor inválido"),
  dueDay: z.number().int().min(1, "Dia entre 1 e 28").max(28, "Dia entre 1 e 28"),
  teacherId: z.string().nullable(),
});

export const teacherProfileSchema = z.object({
  specialty: z.string().trim().min(1, "Informe a especialidade"),
});

export const personInputSchema = z
  .object({
    name: z.string().trim().min(2, "Nome muito curto").max(120),
    email: z.string().trim().toLowerCase().email("E-mail inválido").max(255),
    phone: z.string().trim().min(8, "Telefone inválido").max(20),
    // CPF e nascimento: opcionais no MVP (o backend valida de verdade depois).
    document: z.string().trim().max(18).or(z.literal("")),
    birthDate: z
      .string()
      .trim()
      .refine((v) => v === "" || !Number.isNaN(Date.parse(v)), "Data inválida")
      .refine((v) => v === "" || new Date(v) < new Date(), "Data no futuro"),
    roles: z.array(personRoleSchema).min(1, "Escolha ao menos um perfil"),
    studentProfile: studentProfileSchema.nullish(),
    teacherProfile: teacherProfileSchema.nullish(),
  })
  .superRefine((value, ctx) => {
    if (value.roles.includes("aluno") && !value.studentProfile) {
      ctx.addIssue({ code: "custom", message: "Preencha os dados de aluno", path: ["studentProfile"] });
    }
    if (value.roles.includes("professor") && !value.teacherProfile) {
      ctx.addIssue({ code: "custom", message: "Preencha os dados de professor", path: ["teacherProfile"] });
    }
  });

export type PersonInputParsed = z.infer<typeof personInputSchema>;
