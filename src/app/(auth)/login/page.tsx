"use client"

import { useRouter } from "next/navigation";
import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { ModalCard } from "@/components/Modals/ModalCard";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useContext, useState } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import Link from 'next/link'
import { GoogleLoginButton } from "@/components/GoogleLoginButton/GoogleLogin";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const signInUserFormSchema = z.object({
  email: z.email("Digite um email válido!"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
})

type signInUserFormData = z.infer<typeof signInUserFormSchema>;

export default function LoginPage() {

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(signInUserFormSchema),
    mode: 'onBlur'
  })

  const { signIn, reloadUser } = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<signInUserFormData> = async (data) => {
    try {
      await signIn(data);
      await reloadUser()
    } catch {
      ["email", "password"].forEach((field) =>
        setError(field as keyof signInUserFormData, {
          type: "manual",
          message: "Email ou senha inválidos",
        })
      );
    }
  };

  return (
    <div className="flex items-center justify-center flex-col gap-4 min-h-screen w-full p-4">
      <ModalCard title="Entrar" subtitle="Entre na sua conta Watchlist.">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="you@email.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-left text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Digite sua senha"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-300"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-left text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex w-full justify-end mb-4">
            <Link href={"/reset-password"} className="text-sm text-gray-500 hover:text-gray-400 transition-all hover:underline">
              Esqueceu sua senha?
            </Link>
          </div>

          <Button size="default" type="submit" disabled={isSubmitting} className="w-full py-5 font-bold">
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-grow border-t border-gray-800" />
          <span className="text-sm text-gray-400">Ou</span>
          <div className="flex-grow border-t border-gray-800" />
        </div>

        <GoogleLoginButton />

        <div className="flex items-center justify-between mt-6">
          <h6 className="text-gray-400 text-sm">Não tem uma conta?</h6>
          <Link href={"/register"}>
            <Button variant="outline" size="sm">Cadastre-se gratuitamente</Button>
          </Link>
        </div>
      </ModalCard>
    </div>
  )
}
