"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModalCard } from "../components/ModalCard";

export default function Home() {
  return (
    <div className="h-screen w-full bg-[#121212]">
      <div className="flex items-center justify-center flex-col gap-4 h-screen w-full max-w-5xl mx-auto">
        <ModalCard title="Verifique seu email" subtitle="Enviamos a você um código de confirmação de seis dígitos para you@email.com. Por favor digite abaixo para confirmar seu endereço de e-mail.">
          <Input placeholder="Digite o código de 5 digitos" />
          <span className="text-gray-500">Não recebeu um código? <span className="underline">Enviar código agora</span></span>
        </ModalCard>
      </div>
    </div>
  );
}
