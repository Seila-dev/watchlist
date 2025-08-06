"use client"

import { VerifyEmailModal } from "@/components/VerifyEmailCode/VerifyEmailModal";
import { useSearchParams } from "next/navigation";


export default function ValidateCode() {

  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="flex items-center justify-center flex-col gap-4 h-screen">
      <VerifyEmailModal email={email || "undefined"}/>
    </div>
  );
}