// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {

  const token = request.cookies.get('watchlist.token');

  const url = request.nextUrl.clone();

  if (!token && url.pathname.startsWith('/home')) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*'],
};
