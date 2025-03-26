import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSupabaseServerClient } from './utils/supabase';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client with the cookies
  const supabase = getSupabaseServerClient(req)

  try {
    // Refresh session if exists
    const { data: { session }, error } = await supabase.auth.getSession();

    // Check if the request is for a protected route
    const isProtectedRoute = req.nextUrl.pathname.startsWith('/products') || 
                           req.nextUrl.pathname.startsWith('/categories') ||
                           req.nextUrl.pathname.startsWith('/profile');

    // If there's no session and trying to access protected route
    if (!session && isProtectedRoute) {
      const redirectUrl = new URL('/auth/signin', req.url);
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If there's a session and trying to access auth pages
    if (session && req.nextUrl.pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 