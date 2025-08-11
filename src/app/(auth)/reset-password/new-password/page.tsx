'use client';

import { ModalCard } from "@/components/Modals/ModalCard";
import { Form, FormItem, FormControl, FormLabel, FormField, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePasswordSchema, ChangePasswordFormData } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useContext, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";

export default function ChangePassword() {
    const router = useRouter();
    const params = useSearchParams();
    const { resetPassword } = useContext(AuthContext);

    const email = useMemo(() => (params.get("email") || "").trim().toLowerCase(), [params]);
    const code = useMemo(() => (params.get("code") || "").trim(), [params]);

    const form = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        mode: "onChange",
        defaultValues: { senha: "", confirmarSenha: "" },
    });

    const { formState: { isValid, isSubmitting } } = form;
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const onSubmit = async (data: ChangePasswordFormData) => {
        setError("");
        setSuccess("");


        const senha = data.senha.trim();
        const confirmarSenha = data.confirmarSenha.trim();

        console.log("Email enviado:", email);
        console.log("Code enviado:", code);
        console.log("Nova senha:", senha);

        if (!email || !code) {
            setError("Link inválido. Refaça o processo de recuperação.");
            return;
        }
        if (senha !== confirmarSenha) {
            setError("As senhas não coincidem.");
            return;
        }

        try {
            await resetPassword(email, code, senha);
            setSuccess("Senha alterada com sucesso! Faça login.");
            setTimeout(() => router.replace("/login"), 800);
        } catch (e: any) {
            const status = e?.status ?? 0;
            if (status === 400 || status === 422) {
                setError(e?.message || "Dados inválidos.");
            } else if (status === 404) {
                setError("Código inválido ou expirado.");
            } else {
                setError(e?.message || "Erro ao alterar senha. Tente novamente.");
            }
        }
    };

    return (
        <main className="bg-background w-full flex items-center justify-center min-h-screen px-4">
            <ModalCard
                title="Alterar sua senha"
                subtitle="Escolha uma nova senha para sua conta."
                className="flex flex-col items-start justify-start gap-6"
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                        <FormField
                            control={form.control}
                            name="senha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[14px] leading-[150%]" htmlFor="senha">Senha</FormLabel>
                                    <FormControl>
                                        <Input id="senha" type="password" placeholder="Nova senha" autoComplete="new-password" {...field} />
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
                                        <Input id="confirmarSenha" type="password" placeholder="Confirmar nova senha" autoComplete="new-password" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-systemStatus-error text-base leading-[150%] mb-6" />
                                </FormItem>
                            )}
                        />

                        {success && <p role="status" className="text-sm text-emerald-500 mt-1">{success}</p>}
                        {error && <p role="alert" className="text-sm text-red-500 mt-1">{error}</p>}

                        <Button
                            type="submit"
                            className={`w-full py-6 mb-3 transition bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 ${(!isValid || isSubmitting) ? "opacity-60 cursor-not-allowed" : ""}`}
                            disabled={!isValid || isSubmitting}
                        >
                            {isSubmitting ? "Salvando..." : "Alterar a senha"}
                        </Button>
                    </form>
                </Form>

                <a className="text-center text-sm" href="#">Retornar à tela de login</a>
            </ModalCard>
        </main>
    );
}
