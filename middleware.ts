import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyIdToken } from './lib/firebaseAdmin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/dashboard') {
    const tokenCookie = request.cookies.get('authToken');
    const token = tokenCookie?.value; // Extract the string value from the cookie

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login'; // Fix the missing quote here
      return NextResponse.redirect(url);
    }

    try {
      await verifyIdToken(token);
    } catch (error) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
