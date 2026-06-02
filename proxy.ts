import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route matches admin paths
  if (pathname.startsWith('/admin')) {
    const tokenCookie = request.cookies.get('cakbud_token');

    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const token = tokenCookie.value;
      const parts = token.split('.');
      if (parts.length < 2) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      const payloadBase64 = parts[1];
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const payloadDecoded = atob(base64);
      const payload = JSON.parse(payloadDecoded);

      if (payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (e) {
      console.error('Failed to parse token in server-side proxy:', e);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
