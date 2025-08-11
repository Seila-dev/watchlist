"use client"

import { ModalCard } from '@/components/Modals/ModalCard';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useContext, useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, user, loading, signOut } = useContext(AuthContext);

    // Loga no console sempre que o user mudar
  useEffect(() => {
    console.log("📌 Usuário atual no AuthContext:", user);
  }, [user]);

  return (
    <main
      className="bg-background flex items-center justify-center w-screen h-screen"
    >
      <ModalCard
        title='Página temporária'
        subtitle='Acesse rapidamente as páginas do projeto'
        className=""
      >
        <div className="p-4 my-4 rounded-md border border-gray-700 bg-gray-900 text-gray-300 w-full max-w-md">
{loading ? (
  <p>💬 Verificando autenticação...</p>
) : isAuthenticated ? (
  <div className="flex flex-col items-center gap-2">
    <p>
      ✅ Logado como{" "}
      <strong>
        {user?.username
          ? user.username
          : user?.name
          ? user.name
          : user?.email}
      </strong>
    </p>
    <Button variant="destructive" onClick={signOut}>
      Sair
    </Button>
  </div>
) : (
  <p>❌ Não autenticado</p>
)}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link href="/register">Cadastro</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/reset-password">Resetar Senha</Link>
          </Button>
        </div>
        <span className="text-xs text-gray-400 mt-6">
          🔹 Esta é apenas uma página de acesso rápido para desenvolvimento
        </span>
      </ModalCard>
    </main>
  );
}
