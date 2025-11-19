import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface UserResponse {
  user: {
    username?: string;
    [key: string]: any;
  };
}

// Cache de validação de usuário para reduzir requisições
const userCache = new Map<string, { user: UserResponse['user'], timestamp: number }>();
const CACHE_TTL = 30000; // 30 segundos

async function validateUserToken(token: string, baseURL: string): Promise<UserResponse['user'] | null> {
  // Verifica cache
  const cached = userCache.get(token);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.user;
  }

  try {
    const response = await fetch(`${baseURL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Adiciona timeout para evitar requisições longas
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      userCache.delete(token);
      return null;
    }

    const data: UserResponse = await response.json();
    
    // Atualiza cache
    userCache.set(token, {
      user: data.user,
      timestamp: Date.now()
    });

    return data.user;
  } catch (error) {
    console.error('Error validating token in middleware:', error);
    userCache.delete(token);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('watchlist.token');
  const url = request.nextUrl.clone();
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.some(path => url.pathname === path || url.pathname.startsWith(`${path}/`));

  const protectedPaths = ['/home'];
  const isProtectedPath = protectedPaths.some(path => url.pathname.startsWith(path));

  if (!token && isProtectedPath) {
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (!token && isPublicPath) {
    return NextResponse.next();
  }

  if (!token && url.pathname.startsWith('/register/create-username')) {
    url.pathname = '/register';
    return NextResponse.redirect(url);
  }

  if (token) {
    const user = await validateUserToken(token.value, baseURL!);

    // Token inválido ou expirado
    if (!user) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('watchlist.token');
      // Limpa o cache
      userCache.clear();
      return response;
    }

    const hasUsername = user.username && user.username.trim() !== '';

    if (!hasUsername && !url.pathname.startsWith('/register/create-username')) {
      url.pathname = '/register/create-username';
      return NextResponse.redirect(url);
    }

    if (hasUsername && (url.pathname === '/login' || url.pathname.startsWith('/register'))) {
      url.pathname = '/home';
      return NextResponse.redirect(url);
    }

    if (!hasUsername && url.pathname === '/login') {
      url.pathname = '/register/create-username';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};