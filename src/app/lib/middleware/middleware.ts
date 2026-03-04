// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define public routes that everyone can access
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/products',
  '/products/',
  '/about',
  '/contact',
  '/cart',
  '/api/auth',
];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if current path is public
    const isPublicRoute = publicRoutes.some(route => 
      path === route || path.startsWith(route + '/')
    );

    // Allow public routes without token
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // If no token and not public route - redirect to login
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', encodeURI(path));
      return NextResponse.redirect(loginUrl);
    }

    // User is authenticated - check role-based access
    const userRole = token.role as string;

    // Define role-based route access
    const adminOnlyRoutes = ['/admin', '/admin/:path*'];
    const userOnlyRoutes = ['/dashboard', '/dashboard/:path*', '/user/:path*'];

    // Check if trying to access admin-only routes
    if (path.startsWith('/admin') && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Check if admin trying to access user-only routes
    if ((path.startsWith('/dashboard') || path.startsWith('/user')) && userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // Allow access to all other routes
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Public routes are always authorized
        if (publicRoutes.some(route => path === route || path.startsWith(route + '/'))) {
          return true;
        }
        
        // Protected routes need token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};