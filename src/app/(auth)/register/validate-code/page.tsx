"use client"

import { VerifyEmailModal } from "@/components/VerifyEmailCode/VerifyEmailModal";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

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
      <div className="flex items-center justify-center flex-col gap-4 h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Email não encontrado</h2>
          <p className="text-gray-600">
            Por favor, volte ao formulário de registro e tente novamente.
          </p>
        </div>
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