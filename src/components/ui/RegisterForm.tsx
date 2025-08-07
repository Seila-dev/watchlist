import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
// criar lógica de submit
// terminar o schema de validação
export const registerSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email precisa ser um email válido"),
  password: z.string()
    .min(6, "No mínimo 6 caracteres")
    .refine((val) => /\d/.test(val), { message: "Deve conter pelo menos 1 número" })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), { message: "Deve conter pelo menos 1 caractere especial" }),
});


interface registerFormProps {
  email: string
  // Última alteração feita: 05/08/2025 por Mauricio
}

export default function RegisterForm({ email }: registerFormProps) {

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: email || "",
      password: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  function onSubmit(data: any) {
    startTransition(() => {
      // Aqui você pode fazer a lógica de cadastro (API, etc)
      // Depois de criar a conta, navegue para outra rota, passando email

      // Passando email via query param, por exemplo: /welcome?email=...
      router.push(`/register/validate-code?email=${encodeURIComponent(data.email)}`);
    });
  }


  return (
    <Form {...form} >
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-4">

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
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled className="bg-gray-100 text-gray-500 cursor-not-allowed" />
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
                <Input type="password" placeholder="Digite a senha" {...field} />
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
