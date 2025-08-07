'use client';

import { ModalCard } from "@/components/Modals/ModalCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormItem, FormControl, FormLabel, FormField, FormMessage } from "@/components/ui/form"
import { forgotPasswordSchema, ForgotPasswordFormData } from "./schema"

export default function ForgetPassword() {
    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    const { handleSubmit, formState: { isSubmitting } } = form

    function onSubmit(data: ForgotPasswordFormData) {
        console.log("Email enviado para:", data.email)
        // lógica API
    }
    return (
        <main className="bg-background flex items-center justify-center min-h-screen px-4">
            <ModalCard
                title="Esqueceu sua senha?"
                subtitle="Digite seu endereço de email abaixo e lhe enviaremos um
                        código para entrar e redefinir sua senha."
                className="flex flex-col items-start justify-start gap-6">

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[14px] leading-[150%]" htmlFor="email">Email</FormLabel>
                                    <FormControl>
                                        <Input id="email" placeholder="you@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-systemStatus-error text-base leading-[150%] mb-6" />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full py-6 mb-3" disabled={isSubmitting}>
                            {isSubmitting ? "loading" : "Enviar código"}
                        </Button>
                    </form>

                </Form>

                <span className="h-0.5 w-[100%] opacity-40 bg-gray-700"></span>

                <div className="text-grayBrand-300 flex items-center justify-between mt-9 gap-8">
                    <p>Lembra da sua senha?</p>
                    <button className="w-[94px] h-[48px] rounded-[8px] border border-grayBrand-800">Entrar</button>
                </div>

            </ModalCard>
        </main >
    )
}