"use client"

import { useEffect, useState, useContext } from "react";
import { ModalCard } from "../Modals/ModalCard"
import { Input } from "../ui/input"
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";

import { toast } from "sonner";

interface VerifyEmailProps {
    email: string;
}


export function VerifyEmailModal({ email }: VerifyEmailProps) {

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
    const pathname = usePathname();
    const router = useRouter();
    const [counter, setCounter] = useState(0);
    const [code, setCode] = useState("");
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        if (counter === 0) return;

        const timer = setInterval(() => {
            setCounter((prev) => prev - 1);
        }, 1000)

        return () => clearInterval(timer);
    }, [counter])

    async function handleResendCode() {
        if (counter > 0) return;

        setIsValidating(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/send-verification-code`, {
                method: "POST",
                body: JSON.stringify({ email }),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Erro ao enviar código");
            }

            toast.success("Código enviado para o e-mail!");
            setCounter(30);
        } catch (err) {
            console.error(err);
            toast.error("Não foi possível enviar o código. Tente novamente.");
            setCode("");
        } finally {
            setIsValidating(false);
        }
    }

    useEffect(() => {
        if (!email) return;

        const storageKey = `codeSentFor_${email}`;
        const alreadySent = sessionStorage.getItem(storageKey);

        if (!alreadySent) {
            handleResendCode();
            sessionStorage.setItem(storageKey, "true");
        }
    }, [email]);


    useEffect(() => {
        if (code.length === 6 && !isValidating) {
            validateCode();
        }
    }, [code]);

    async function validateCode() {
        setIsValidating(true);
        try {

            const response = await fetch(`${API_BASE_URL}/auth/validate-verification-code`, {
                method: "POST",
                body: JSON.stringify({ email, code }),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                toast.error("Código fornecido inválido.");
                setCode("");
                setIsValidating(false);
                return;
            }

            if (pathname.startsWith("/register/validate-code")) {
                router.push("/login");
                toast.success("Código confirmado, realize seu login!")
            } else if (pathname.startsWith("/reset-password")) {
                router.push("/reset-password/new-password");
                toast.success("Código confirmado, altere sua senha!")
            } else {
                router.push("/");
                toast.error("Ocorreu algum erro, tente novamente!")
            }

        } catch (err) {
            console.error(err);
            toast.warning("Código inválido. Tente novamente.");
            setCode("");
        } finally {
            setIsValidating(false);
        }
    }


    return (
        <ModalCard title="Verifique seu email" subtitle={`Enviamos a você um código de confirmação de seis dígitos para ${email}. Por favor digite abaixo para confirmar seu endereço de e-mail.`}>
            <div className="space-y-1">

                <Input
                    placeholder="Digite o código de 6 dígitos"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={isValidating}
                />

                {isValidating && (
                    <span className="text-sm text-grayBrand-500">Processando aguarde...</span>
                )}

                {isValidating ? null : (
                    counter > 0 ? (
                        <span className="text-sm text-grayBrand-500">
                            Reenviar código em {counter}s
                        </span>
                    ) : (
                        <div className="flex gap-2">
                            <span className="text-sm text-grayBrand-500">Não recebeu um código?</span>
                            <Button
                                variant="link"
                                onClick={handleResendCode}
                                className="text-sm text-grayBrand-500 p-0 h-auto underline hover:text-grayBrand-300"
                            >
                                Enviar código agora
                            </Button>
                        </div>
                    )
                )}

            </div>
        </ModalCard>
    )
}