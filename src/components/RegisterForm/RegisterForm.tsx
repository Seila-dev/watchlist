"use client"
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
// criar lógica de submit
// terminar o schema de validação
interface registerFormProps {
  email: string;
  // Última alteração feita: 05/08/2025 por Mauricio
}

export default function RegisterForm({ email }: registerFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const registerSchema = z.object({
    firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    password: z
      .string()
      .min(6, "No mínimo 6 caracteres")
      .refine((val) => /\d/.test(val), {
        message: "Deve conter pelo menos 1 número",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Deve conter pelo menos 1 caractere especial",
      }),
    email: z.email("Email inválido"),
  });

  type RegisterFormData = z.infer<typeof registerSchema>;

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      password: "",
      email: email,
    },
  });

  function onSubmit(data: RegisterFormData) {
    startTransition(() => {
      // Aqui você pode fazer a lógica de envio do formulário, como uma requisição para a API
      console.log("Formulário enviado com sucesso!", data);
      // Após o envio bem-sucedido, redirecionar para a página de validação de código
      router.push("/register/validate-code");
    });
  }


  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primeiro Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled
                  className="bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Digite a senha"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>
    </Form>
  );
}
