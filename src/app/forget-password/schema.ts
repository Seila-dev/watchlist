import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z.string().email("Algo não está certo. Confira seu email e tente novamente."),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;