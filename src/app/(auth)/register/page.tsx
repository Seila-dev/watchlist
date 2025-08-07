"use client";
import { useState } from "react";
import { GoogleLoginButton } from "@/components/GoogleLoginButton/GoogleLogin";
import { ModalCard } from "@/components/Modals/ModalCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import RegisterForm from "@/components/RegisterForm/RegisterForm";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [showForm, setShowForm] = useState(false);

  const emailSchema = z.object({
    email: z.email("Digite um email válido!"),
    // da pra adicionar mais uma validação usando refine
  });

  type FormData = z.infer<typeof emailSchema>;

  const {
    register,
    handleSubmit,
    getValues,
    // Não sei se estou fazendo o uso correto do getValues
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: FormData) {
    setShowForm(true);
  }

  return (
    <div className="flex items-center justify-center flex-col gap-4 min-h-screen">
      <ModalCard title="Inscrever-se" subtitle="Crie sua conta Watchlist.">
        {!showForm ? (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Label htmlFor="email">Email</Label>
              <Input
                placeholder="you@email.com"
                type="email"
                value={email}
                {...register("email")}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500/80 text-xs">{errors.email.message}</p>
              )}
              <Button size={"lg"} type="submit" className="w-full">
                Continuar com Email
              </Button>
            </form>
            <div className="flex items-center gap-3 my-6">
              <div className="flex-grow border-t border-gray-800" />
              <span className="text-sm text-gray-800">Ou</span>
              <div className="flex-grow border-t border-gray-800" />
            </div>
            <GoogleLoginButton />
          </>
        ) : (
          // Renderiza o formulário se o úsuario tiver preenchido o email
          // getValues para pegar o email do formulário anterior
          <RegisterForm email={getValues("email")} />
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
