// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.next();
    }

    const userRole = token.role as string;


    const isAdminRoute = path.startsWith('/dashboard/admin');
    

    const isUserDashboardRoute = path.startsWith('/dashboard') && !isAdminRoute;
    const isUserProfileRoute = path.startsWith('/user');

   
    if (isAdminRoute && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

   
    if ((isUserDashboardRoute || isUserProfileRoute) && userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/admin', req.url));
    }

  
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Define public routes
        const publicRoutes = ['/', '/login', '/register', '/about', '/contact', '/api/auth'];
        const isPublic = publicRoutes.some(route => 
          path === route || path.startsWith(route + '/')
        );

        if (isPublic) return true;

     
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
  
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};