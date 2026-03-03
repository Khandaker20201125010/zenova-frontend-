import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Define routes
    const adminRoutes = ['/admin', '/admin/:path*'];
    const userRoutes = ['/dashboard', '/dashboard/:path*', '/user/:path*'];
    const publicRoutes = ['/', '/products', '/about', '/contact', '/login', '/register', '/cart'];

    // If no token, redirect to login for protected routes
    if (!token) {
      // Check if current path is a protected route
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
      
      return NextResponse.next();
    }

    // User is authenticated - check role-based access
    const userRole = token.role as string;

    // Admin trying to access user routes (redirect to admin dashboard)
    if (userRole === 'ADMIN' && path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // Admin trying to access user profile (redirect to admin dashboard)
    if (userRole === 'ADMIN' && path.startsWith('/user')) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // Regular user trying to access admin routes (redirect to user dashboard)
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
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/user/:path*',
  ],
};