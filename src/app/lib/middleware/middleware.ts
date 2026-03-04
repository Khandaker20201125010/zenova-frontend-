// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Debug - remove in production
    console.log("Middleware:", { path, hasToken: !!token, role: token?.role });

    // If no token and trying to access protected route
    if (!token) {
      const isProtectedRoute = path.startsWith('/admin') || 
                               path.startsWith('/dashboard') || 
                               path.startsWith('/user');
      
      if (isProtectedRoute) {
        const url = new URL('/login', req.url);
        url.searchParams.set('callbackUrl', encodeURI(path));
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    // Role-based access control
    const userRole = token.role as string;

    // Admin trying to access user routes
    if (userRole === 'ADMIN' && (path.startsWith('/dashboard') || path.startsWith('/user'))) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // User trying to access admin routes
    if (userRole !== 'ADMIN' && path.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/user/:path*'],
};