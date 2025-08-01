"use client"

import { ModalCard } from "@/components/ModalCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleLogo } from "phosphor-react";


export default function LoginPage() {
  return (
    <div className="flex items-center justify-center flex-col gap-4 h-screen">


      {/* MODELO ABAIXO DE TESTE PARA TESTAR O MODAL */}

      <ModalCard title="Entrar" subtitle="Entre na sua conta Watchlist.">
        <span>Email</span>
        <Input />
        <span>Senha</span>
        <Input />
        <span className="flex justify-end text-[13px] text-grayBrand-400">Esqueceu sua senha ?</span>

        <Button className="mt-2">Entrar</Button>

        <div className="flex  w-full justify-between items-center gap-2">
          <span className="h-0.5 w-[70%] opacity-40 bg-gray-400"></span>
          <span className="text-white font-bold">ou</span>
          <span className="h-0.5 w-[70%] opacity-40 bg-gray-400"></span>
        </div>
        <div className="flex flex-col gap-6">
          <Button variant={"outline"} className="flex justify-center items-center font-bold">
            <GoogleLogo width={22} height={22} /> Continue com o Google
          </Button>
        </div>

        <span className="h-0.5 w-[100%] opacity-40 bg-grayBrand-300 my-3"></span>

        <div className="flex gap-14 justify-center items-center">
          <span className="text-[14px] text-grayBrand-400">Nao tem uma conta ?</span>
          <Button variant={"outline"} className="border-grayBrand-400">Cadastre-se gratuitamente</Button>
        </div>
      </ModalCard>

      
    </div>
  );
}