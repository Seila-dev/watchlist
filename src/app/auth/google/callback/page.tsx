'use client'

import { useEffect } from 'react';

export default function GoogleCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (code) {
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_SUCCESS',
        code
      }, window.location.origin);
    } else if (error) {
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_ERROR',
        error
      }, window.location.origin);
    }

    window.close();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Processando login...</p>
      </div>
    </div>
  );
}
