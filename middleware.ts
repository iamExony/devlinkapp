// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyIdToken } from './lib/firebaseAdmin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/dashboard') {
    const token = request.cookies.get('authToken');

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    try {
      await verifyIdToken(token);
    } catch (error) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
