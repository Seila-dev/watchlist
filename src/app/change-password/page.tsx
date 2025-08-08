'use client';

import { ModalCard } from "@/components/Modals/ModalCard";
import { Form, FormItem, FormControl, FormLabel, FormField, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePasswordSchema, ChangePasswordFormData } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function ChangePassword() {


    const form = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        mode: "onChange",
        defaultValues: {
            senha: "",
            confirmarSenha: ""
        },
    })

    const isValid = form.formState.isValid;

    function onSubmit(data: ChangePasswordFormData) {
        console.log("Nova senha:", data.senha);
        // lógica API
    }

    return (
        <main className="bg-background flex items-center justify-center min-h-screen px-4">
            <ModalCard
                title="Alterar sua senha"
                subtitle="Escolha uma nova senha para sua conta."
                className="flex flex-col items-start justify-start gap-6">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="senha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[14px] leading-[150%]" htmlFor="senha">Senha</FormLabel>
                                    <FormControl>
                                        <Input id="senha" type="password" placeholder="nova senha" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-systemStatus-error text-base leading-[150%] mb-6" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmarSenha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[14px] leading-[150%]" htmlFor="confirmarSenha">Confirme sua senha</FormLabel>
                                    <FormControl>
                                        <Input id="confirmarSenha" type="password" placeholder="Confirmar nova senha" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-systemStatus-error text-base leading-[150%] mb-6" />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full py-6 mb-3 transition ${isValid ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90' : 'bg-gray-600 cursor-not-allowed'}" disabled={!isValid} >
                            Alterar a senha
                        </Button>
                    </form>

                </Form>

                <a className="text-center text-sm" href="#">Pular</a>

            </ModalCard>
        </main>
    )
}