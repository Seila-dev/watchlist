"use client"

import { VerifyEmailModal } from "@/components/VerifyEmailCode/VerifyEmailModal";
import { ModalCard } from "@/components/Modals/ModalCard";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ValidateCodeContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams?.get("email");
    console.log("Email param from URL:", emailParam);

    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  if (!email) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <ModalCard
          title="Não foi possivel prosseguir!"
          subtitle="Não conseguimos encontrar seu e-mail, retorne para a tela de registro e realize o processo novamente."
        >
          <div className="flex items-center justify-center">
            <Button asChild>
              <Link href="/register">Voltar para a página de cadastro</Link>
            </Button>
          </div>
        </ModalCard>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center flex-col gap-4 h-screen">
      <VerifyEmailModal email={email} />
    </div>
  );
}

export default function ValidateCode() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center flex-col gap-4 h-screen">
        <div>Carregando...</div>
      </div>
    }>
      <ValidateCodeContent />
    </Suspense>
  );
}