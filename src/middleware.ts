// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface UserResponse {
  user: {
    username?: string;
    [key: string]: any;
  };
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('watchlist.token');
  const url = request.nextUrl.clone();

  if (!token && url.pathname.startsWith('/home')) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (!token && url.pathname.startsWith('/register/create-username')) {
    url.pathname = '/register';
    return NextResponse.redirect(url);
  }

  if (token) {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseURL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
        redirectResponse.cookies.delete('watchlist.token');
        return redirectResponse;
      }

      const data: UserResponse = await response.json();
      const hasUsername = data.user.username && data.user.username.trim() !== '';

      if (!hasUsername && !url.pathname.startsWith('/register/create-username')) {
        url.pathname = '/register/create-username';
        return NextResponse.redirect(url);
      }

      if (hasUsername && (
        url.pathname === '/login' || 
        url.pathname.startsWith('/register')
      )) {
        url.pathname = '/home';
        return NextResponse.redirect(url);
      }

      // Se não tem username e tenta acessar login (usuário já registrado mas sem username)
      if (!hasUsername && url.pathname === '/login') {
        url.pathname = '/register/create-username';
        return NextResponse.redirect(url);
      }

    } catch (error) {
      console.error('Error fetching user:', error);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('watchlist.token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/register/:path*', '/login', '/home'],
};