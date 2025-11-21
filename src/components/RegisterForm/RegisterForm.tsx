import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import {
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
import { toast } from "sonner";
import { LoadingOverlay } from "../Loading/LoadingOverlay";

interface RegisterFormProps {
  email?: string;
  onStartLoading?: () => void;
  onFinishLoading?: () => void;
}

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
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

export default function RegisterForm({
  email,
  onStartLoading,
  onFinishLoading,
}: RegisterFormProps) {
  const { registerAccount, signIn } = useContext(AuthContext);
  const router = useRouter();

  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      email: email || "",
      name: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    onStartLoading?.();

    try {
      await registerAccount(data);

      await signIn({
        email: data.email,
        password: data.password
      })
      router.push(`/register/validate-code?email=${encodeURIComponent(data.email)}`);
    }
    catch (error: any) {
      if (error?.message === "E-mail already exists" || /already exists/i.test(error?.message)) {
        methods.setError("email", {
          type: "manual",
          message: "Este e-mail já está em uso",
        });
      } else {
        console.error("Erro no registro:", error);
        toast.error("Erro ao criar a conta. Tente novamente.");
      }
    } finally {
      onFinishLoading?.();
    }
  };

  return (
    <FormProvider {...methods}>
      {methods.formState.isSubmitting && <LoadingOverlay message="Criando conta..." />}

      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="name"
          control={methods.control}
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
          control={methods.control}
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
          control={methods.control}
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

        <Button type="submit" disabled={methods.formState.isSubmitting} className="w-full">
          {methods.formState.isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>
    </FormProvider>
  );
}