import { z } from "zod";

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .refine((val) => /\d/.test(val), {
        message: "Deve conter pelo menos 1 número",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Deve conter pelo menos 1 caractere especial",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem! Tente novamente.',
    path: ['confirmPassword'], 
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
