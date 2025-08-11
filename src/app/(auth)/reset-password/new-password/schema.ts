import { z } from "zod"

export const changePasswordSchema = z
    .object({
        password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas não coincidem! Tente novamente.',
        path: ['confirmarSenha'],
    })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>