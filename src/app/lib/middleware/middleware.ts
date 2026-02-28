// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Define role-based access
    const adminRoutes = ['/admin', '/admin/:path*'];
    const userRoutes = ['/dashboard', '/user/:path*', '/orders', '/favorites'];
    const publicRoutes = ['/', '/products', '/about', '/contact', '/login', '/register'];

    // Redirect unauthenticated users trying to access protected routes
    if (!token) {
      // Check if the route is protected
      const isProtectedRoute = [...adminRoutes, ...userRoutes].some(route => {
        if (route.includes(':path*')) {
          const baseRoute = route.replace('/:path*', '');
          return path.startsWith(baseRoute);
        }
        return path === route;
      });

      if (isProtectedRoute) {
        const url = new URL('/login', req.url);
        url.searchParams.set('callbackUrl', encodeURI(path));
        return NextResponse.redirect(url);
      }
    }

    // Role-based access control
    if (token) {
      // Admin only routes
      if (path.startsWith('/admin') && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // Regular users can't access certain admin routes
      if (path.startsWith('/admin') && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
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
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/user/:path*',
    '/orders/:path*',
    '/favorites/:path*',
    '/profile/:path*',
  ],
};