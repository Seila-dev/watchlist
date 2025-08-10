"use client"

import { ModalCard } from "@/components/Modals/ModalCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useRouter } from "next/navigation";
import Link from "next/link";

const usernameFormSchema = z.object({
  username: z.string().min(3, "Nome de usuário deve ter no mínimo 3 caracteres!")
    .regex(/^\S+$/, "Nome de usuário não pode conter espaços!")
})


export default function CreateUsername() {

  const router = useRouter()
  const { createUsername, user } = useContext(AuthContext)

  const form = useForm<z.infer<typeof usernameFormSchema>>({
    resolver: zodResolver(usernameFormSchema),
    defaultValues: {
      username: "",
    },
  })

  const { formState: { isSubmitting } } = form;

  async function onSubmit(values: z.infer<typeof usernameFormSchema>) {
    await createUsername(values)
    router.push("/home")
  }

  //Fazer alguma validação para quando estiver criando nao conseguir acessar mais a url depois de criado, talvez validar se dentro do user logado ja tem username, porq
  //quando tiver a opção dentro do site para alterar o username vai usar um page -- //update-username  não esta mesma ja criada

  if (user?.username) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <ModalCard
          title="Não foi possivel prosseguir!"
          subtitle="Esta rota é somente para criação de cadastros, caso necessite alterar seu username, realize login e altere na plataforma"
        >
          <div className="flex items-center justify-center">
            <Button asChild>
              <Link href="/login">Voltar para a página de login</Link>
            </Button>
          </div>
        </ModalCard>
      </div>
    );
  }

  return (
    <div className=" bg-background flex items-center justify-center flex-col gap-4 h-screen">
      <ModalCard title="Crie seu nome de usuário" subtitle="Vamos criar um nome de usuário para você se identificar dentro da plataforma.">
        <div>
          <Form {...form}>
            <form className="flex flex-col space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu nome de usuário" {...field} autoComplete="off" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isSubmitting}>{isSubmitting ? "Cadastrando..." : "Cadastrar username e acessar!"}</Button>
            </form>
          </Form>
        </div>
      </ModalCard>
    </div>
  );
}
