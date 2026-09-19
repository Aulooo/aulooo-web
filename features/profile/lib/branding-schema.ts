import * as z from "zod";

export const brandingInputSchema = z.object({
  brandColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Use o formato #RRGGBB"),
});
