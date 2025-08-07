"use client"

import { useEffect, useContext, useRef } from "react";
import { ModalCard } from "../Modals/ModalCard"
import { Input } from "../ui/input"
import { Button } from "../ui/button";
import { AuthContext } from "@/contexts/AuthContext";

interface VerifyEmailProps {
    email: string;
}

export function VerifyEmailModal({ email }: VerifyEmailProps) {
    const {
        emailVerification,
        sendVerificationCode,
        setVerificationCode,
        resendVerificationCode
    } = useContext(AuthContext);

    const hasSentCode = useRef(false);

useEffect(() => {
  if (!email || hasSentCode.current) return;

  const storageKey = `codeSentFor_${email}`;
  const alreadySent = typeof window !== "undefined" && sessionStorage.getItem(storageKey);

  if (!alreadySent) {
    console.log("Chamando sendVerificationCode!");
    sendVerificationCode(email);
    hasSentCode.current = true;
    sessionStorage.setItem(storageKey, "true");
  }
}, []);

    const handleCodeChange = (value: string) => {
        // Only allow numeric characters and limit to 6 digits
        const numericValue = value.replace(/\D/g, '').slice(0, 6);
        setVerificationCode(numericValue);
    };

    const canResend = emailVerification.counter === 0 && !emailVerification.isVerifying;

    return (
        <ModalCard 
            title="Verifique seu email" 
            subtitle={`Enviamos a você um código de confirmação de seis dígitos para ${email}. Por favor digite abaixo para confirmar seu endereço de e-mail.`}
        >
            <div className="space-y-1">
                <Input
                    placeholder="Digite o código de 6 dígitos"
                    maxLength={6}
                    value={emailVerification.code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    disabled={emailVerification.isVerifying}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                />

                {emailVerification.isVerifying && (
                    <span className="text-sm text-grayBrand-500">
                        Processando aguarde...
                    </span>
                )}

                {!emailVerification.isVerifying && (
                    emailVerification.counter > 0 ? (
                        <span className="text-sm text-grayBrand-500">
                            Reenviar código em {emailVerification.counter}s
                        </span>
                    ) : (
                        <div className="flex gap-2">
                            <span className="text-sm text-grayBrand-500">
                                Não recebeu um código?
                            </span>
                            <Button
                                variant="link"
                                onClick={resendVerificationCode}
                                disabled={!canResend}
                                className="text-sm text-grayBrand-500 p-0 h-auto underline hover:text-grayBrand-300 disabled:opacity-50"
                            >
                                Enviar código agora
                            </Button>
                        </div>
                    )
                )}
            </div>
        </ModalCard>
    );
}