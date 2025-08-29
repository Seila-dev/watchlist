// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('watchlist.token');
  const url = request.nextUrl.clone();

  // Se não tem token e tenta acessar páginas protegidas
  if (!token && url.pathname.startsWith('/home')) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (!token && url.pathname.startsWith('/register/create-username')) {
    url.pathname = '/register';
    return NextResponse.redirect(url);
  }

  if (token && (url.pathname === '/login' || url.pathname.startsWith('/register'))) {
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/register/:path*', '/login', '/home'],
};