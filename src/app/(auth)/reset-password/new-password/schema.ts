import { z } from "zod"

export const changePasswordSchema = z
    .object({
        senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
        confirmarSenha: z.string(),
    })
    .refine((data) => data.senha === data.confirmarSenha, {
        message: 'As senhas não coincidem! Tente novamente.',
        path: ['confirmarSenha'],
    })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>