"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ModalCard } from "../components/ModalCard";

export default function Home() {
  return (
    <div className="h-screen w-full bg-[#121212]">
    <div className="flex items-center justify-center flex-col gap-4 h-screen w-full max-w-5xl mx-auto">
{/*       
      <h1 className="text-black text-5xl font-bold">ÁREA DE TESTE DE COMPONENTES</h1>
      <Image
        alt="testeLogo"
        src={'/assets/logos/watchlist-logo-dark.webp'}
        width={150}
        height={80}
      />
      <h1 className="text-black text-5xl font-bold">HOME PAGE</h1>

      <Button className="font-bold w-48 p-3 text-white">
        ENTRAR
      </Button>

      <span className="font-bold">Input abaixo com focus indigo-700:</span>
      <Input /> */}

      <ModalCard title="Verifique seu email" subtitle="Enviamos a você um código de confirmação de seis dígitos para you@email.com. Por favor digite abaixo para confirmar seu endereço de e-mail.">
        <Input placeholder="Digite o código de 5 digitos" />
        <span className="text-gray-500">Não recebeu um código? <span className="underline">Enviar código agora</span></span>
      </ModalCard>
    </div>
    </div>
  );
}
