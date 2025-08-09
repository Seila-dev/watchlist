'use client'

import { AuthContext } from '@/contexts/AuthContext';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import { useContext, useEffect } from 'react';
import { toast } from 'sonner';

export function GoogleLoginButton() {

  const router = useRouter();
  const { reloadUser } = useContext(AuthContext);
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'watchlist.token';

    useEffect(() => {
    console.log('Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  }, []);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const res = await fetch(`${baseURL}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!res.ok) {
        console.error('Erro no login com Google');
        return;
      }

      const data = await res.json();

      if (data.token) {
        setCookie(null, cookieName, data.token, {
          maxAge: 60 * 60 * 12, // 12h
          path: '/',
        });
      }

      await reloadUser()

      router.push('/home');
      toast.success('Usuário logado com sucesso')

    } catch (err) {
      console.error('Erro inesperado:', err);
      toast.error('Houve um erro inesperado. Tente novamente ou outra forma de login.')
    }
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log('Login Failed')}
        text="continue_with"
        size="large"  
        width="200" 
      />
    </div>
  )
}