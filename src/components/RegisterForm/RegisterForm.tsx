import { useForm, SubmitHandler } from "react-hook-form";
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
import { useContext } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
interface registerFormProps {
  email?: string;
  // Última alteração feita: 05/08/2025 por Mauricio
}

export default function RegisterForm({ email }: registerFormProps) {
  const { registerAccount } = useContext(AuthContext);

  const router = useRouter();

  const registerSchema = z.object({
    username: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    password: z
      .string()
      .min(6, "No mínimo 6 caracteres")
      .refine((val) => /\d/.test(val), {
        message: "Deve conter pelo menos 1 número",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|>]/.test(val), {
        message: "Deve conter pelo menos 1 caractere especial",
      }),
    email: z.email("Email inválido"),
  });

  type RegisterFormData = z.infer<typeof registerSchema>;

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: email || "",
    },
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      await registerAccount(data);
      router.push(
        `/register/validate-code?email=${encodeURIComponent(data.email)}`
      );
    } catch (error: any) {
      // não sei porque ta caindo nesse erro
      console.error("Erro ao registrar conta:", error);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
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
                  readOnly
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

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>
    </Form>
  );
}
