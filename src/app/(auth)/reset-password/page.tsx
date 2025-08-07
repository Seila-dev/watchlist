import { VerifyEmailModal } from "@/components/VerifyEmailCode/VerifyEmailModal";

export default function ResetPassword() {
  
  {/*
    Quando criarem e clicar para enviar o código fazer a seguinte rota
    router.push(`/reset-password/validate-code?email=${encodeURIComponent(data.email)}`);

    */}

  return (
    <div className="flex items-center justify-center flex-col gap-4 h-screen">
      <h1 className="text-gray-400 text-4xl">RESET-PASSWORD PAGE</h1>
    </div>
  );
}