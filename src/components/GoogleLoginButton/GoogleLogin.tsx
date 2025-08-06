'use client'

import { CredentialResponse, GoogleLogin } from '@react-oauth/google'

export function GoogleLoginButton() {

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    //Login e demais
  }

  return <GoogleLogin onSuccess={handleSuccess} onError={() => console.log('Login Failed')} text='continue_with'/>
}