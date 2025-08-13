// app/auth/google/callback/page.tsx
'use client'

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams?.get('code');
    const error = searchParams?.get('error');

    if (code) {
      // Envia o código de autorização para a janela pai
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_SUCCESS',
        code: code
      }, window.location.origin);
    } else if (error) {
      // Envia erro para a janela pai
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_ERROR',
        error: error
      }, window.location.origin);
    }

    // Fecha a janela popup
    window.close();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Processando login...</p>
      </div>
    </div>
  );
}