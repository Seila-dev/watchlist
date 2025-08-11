'use client';

import { Suspense, useContext, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { ModalCard } from "@/components/Modals/ModalCard";
import { Form, FormItem, FormControl, FormLabel, FormField, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePasswordSchema, ChangePasswordFormData } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthContext } from "@/contexts/AuthContext";

export default function ChangePassword() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center w-screen h-screen">Carregando...</div>}>
            <ChangePasswordContent />
        </Suspense>
    );
}

function ChangePasswordContent() {
    const router = useRouter();
    const params = useSearchParams();
    const { resetPassword } = useContext(AuthContext);

    const email = useMemo(() => (params.get("email") || "").trim().toLowerCase(), [params]);
    const code = useMemo(() => (params.get("code") || "").trim(), [params]);

    const form = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        mode: "onBlur",
        defaultValues: { password: "", confirmPassword: "" },
    });

    const { formState: { isValid, isSubmitting } } = form;
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const onSubmit = async (data: ChangePasswordFormData) => {
        setError("");
        setSuccess("");

        const password = data.password.trim();
        const confirmPassword = data.confirmPassword.trim();

        if (!email || !code) {
            setError("Link inválido. Refaça o processo de recuperação.");
            return;
        }
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        try {
            await resetPassword(email, code, password);
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
        <main className="flex items-center justify-center p-10 sm:p-0 w-screen min-h-screen">
            <ModalCard
                title="Alterar sua senha"
                subtitle="Escolha uma nova senha para sua conta."
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="senha">Senha</FormLabel>
                                    <FormControl>
                                        <Input id="senha" type="password" placeholder="Nova senha" autoComplete="new-password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="confirmPassword">Confirme sua senha</FormLabel>
                                    <FormControl>
                                        <Input id="confirmPassword" type="password" placeholder="Confirmar nova senha" autoComplete="new-password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {success && <p role="status" className="text-sm text-emerald-500 mt-1">{success}</p>}
                        {error && <p role="alert" className="text-sm text-red-500 mt-1">{error}</p>}

                        <Button
                            type="submit"
                            className="w-full my-5"
                            disabled={!isValid || isSubmitting}
                            variant={"default"}
                        >
                            {isSubmitting ? "Salvando..." : "Alterar a senha"}
                        </Button>
                    </form>
                </Form>

                <div className="w-full flex justify-center">
                    <Link className="text-xs font-bold" href="/login">
                        Voltar
                    </Link>
                </div>
            </ModalCard>
        </main>
    );
}
