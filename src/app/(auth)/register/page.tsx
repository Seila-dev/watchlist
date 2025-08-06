"use client";

import { useState } from "react";
import { GoogleLoginButton } from "@/components/GoogleLoginButton/GoogleLogin";
import { ModalCard } from "@/components/Modals/ModalCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import RegisterForm from "@/components/ui/RegisterForm";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [showForm, setShowForm] = useState(false);

  function handleContinue() {
    if (email.trim() !== "") {
      setShowForm(true);
    }
  }

  return (
    <div className="flex items-center justify-center flex-col gap-4 h-screen">
      <ModalCard title="Inscrever-se" subtitle="Crie sua conta Watchlist.">
        {!showForm ? (
          <>
            <Label htmlFor="email">Email</Label>
            <Input
              placeholder="you@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* adicionar validação de email com zod */}
            <Button size={"lg"} onClick={handleContinue}>
              Continuar com Email
            </Button>
            <div className="flex items-center gap-3 my-6">
              <div className="flex-grow border-t border-gray-800" />
              <span className="text-sm text-gray-800">Ou</span>
              <div className="flex-grow border-t border-gray-800" />
            </div>
            <GoogleLoginButton />
          </>
        ) : (
          // Renderiza o formulário se o úsuario tiver preenchido o email
          <RegisterForm email={email} />
        )}

        <p className="text-gray-500 text-xs my-8">
          By clicking "Create account" above, you acknowledge that you will
          receive updates from the Watchlist team and that you have read,
          understood, and agreed to{" "}
          <span className="border-b border-gray-500 hover:text-gray-400 transition-all duration-300">
            Terms & Conditions
          </span>{" "}
          and{" "}
          <span className="border-b border-gray-500  hover:text-gray-400 transition-all duration-300">
            Privacy Policy.
          </span>
        </p>

        <hr className="border-gray-800 mb-7" />

        <div className="flex items-center justify-between">
          <h6 className="text-[#D1D5DB]">Já tem uma conta?</h6>
          <Link href={"/login"}>
            <Button variant={"outline"}>Entrar</Button>
          </Link>
        </div>
      </ModalCard>
    </div>
  );
}
