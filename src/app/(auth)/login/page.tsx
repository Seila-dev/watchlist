"use client"

import Modal from "@/components/ComponentModalTest";
import Button from "@/components/ui/ButtonTest";
import { useState } from "react";

export default function LoginPage() {
    const [isOpen, setIsOpen] = useState(false);

  return (
    // This is a simple login page with buttons and a modal for testing purposes
    <div className="flex items-center justify-center flex-col gap-4 h-screen">
      <h1 className="text-gray-400 text-4xl">Login Teste</h1>
      <Button variant="primary">Clique aqui</Button>
      <Button variant="secondary">Cancelar</Button>
      <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}