"use client"

import { VerifyEmailModal } from "@/components/VerifyEmailCode/VerifyEmailModal";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function ValidateCode() {

  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    setEmail(emailParam);
  }, []);

  return (
    <div className="flex items-center justify-center flex-col gap-4 h-screen">
      <VerifyEmailModal email={email || "undefined"}/>
    </div>
  );
}