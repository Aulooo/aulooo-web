import * as z from "zod";

export const signInSchema = z.object({
    email: z.string().min(5).max(255),
    password: z.string().min(8).max(255)
})