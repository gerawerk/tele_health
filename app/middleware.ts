import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isOnboarding = req.nextUrl.pathname.startsWith('/onboarding');
    const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');
    const isAuth = req.nextUrl.pathname.startsWith('/auth');

    // If user is not authenticated and trying to access protected routes
    if (!token && (isOnboarding || isDashboard)) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // If user is authenticated
    if (token) {
      // If profile is not complete and not on onboarding page
      if (!token.profileComplete && !isOnboarding && !isAuth) {
        return NextResponse.redirect(new URL('/onboarding', req.url));
      }

      // If profile is complete and on onboarding page
      if (token.profileComplete && isOnboarding) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // If authenticated and on auth pages
      if (isAuth) {
        const redirectUrl = token.profileComplete ? '/dashboard' : '/onboarding';
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // We handle authorization in the middleware function
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/auth/:path*', '/']
};