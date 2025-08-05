import { VerifyEmailModal } from "@/components/VerifyEmailCode/VerifyEmailModal";

export default function ValidateCode() {
  return (
    <div className="flex items-center justify-center flex-col gap-4 h-screen">
      <VerifyEmailModal email="rafaelfinkanselmo99@gmail.com"/>
    </div>
  );
}