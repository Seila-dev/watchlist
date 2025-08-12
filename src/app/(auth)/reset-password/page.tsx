'use client';

import { ModalCard } from "@/components/Modals/ModalCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormControl, FormLabel, FormField, FormMessage } from "@/components/ui/form";
import { forgotPasswordSchema, ForgotPasswordFormData } from "./schema";
import { useState, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgetPassword() {
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const { sendVerificationCode } = useContext(AuthContext);
    const router = useRouter();

    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onChange",
        defaultValues: { email: "" },
    });

    const { formState: { isSubmitting, isValid } } = form;

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setError("");
        setSuccess("");

        const email = data.email.trim().toLowerCase();

        try {
            await sendVerificationCode(email);
            setSuccess("Te enviamos um código para redefinir sua senha. Verifique seu email.");
            router.push(`/reset-password/validate-code?email=${encodeURIComponent(data.email)}`);
        } catch (e: any) {
            const status = e?.status;
            if (status === 404) {
                setError("Email não cadastrado.");
            }
        }
    };

    return (
        <main className="flex items-center justify-center p-10 sm:p-0 w-screen min-h-screen">
            <ModalCard
                title="Esqueceu sua senha?"
                subtitle="Digite seu endereço de email abaixo e lhe enviaremos um código para entrar e redefinir sua senha."
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[14px] leading-[150%]" htmlFor="email">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="email"
                                            placeholder="you@email.com"
                                            autoComplete="email"
                                            inputMode="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-systemStatus-error text-base leading-[150%] mb-2" />
                                </FormItem>
                            )}
                        />

                        {success && (
                            <p role="status" className="text-sm text-emerald-500 mt-2">{success}</p>
                        )}
                        {error && (
                            <p role="alert" className="text-sm text-red-500 mt-2">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full py-6 mt-4 mb-3"
                            disabled={isSubmitting || !isValid}
                        >
                            {isSubmitting ? "Enviando" : "Enviar código"}
                        </Button>
                    </form>
                </Form>

                <span className="h-0.5 w-full opacity-40 bg-gray-700"></span>

                <div className="text-grayBrand-300 flex items-center justify-between mt-9 gap-8 w-full">
                    <p>Lembra da sua senha?</p>
                    <Link href={"/login"}>
                        <Button variant={"outline"}>Entrar</Button>
                    </Link>
                </div>
            </ModalCard>
        </main>
    );
}