// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const userRole = (token?.role as string)?.toUpperCase();

    // 1. Protect Admin Pages
    if (path.startsWith("/dashboard/admin")) {
      if (userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // 2. Protect User Pages from Admins
    // Add every path here that an ADMIN should never see
    const userSpecificPaths = [
      "/dashboard/user",
      "/dashboard/user/profile",
      "/dashboard/user/my-orders"
      
    ];

    const isUserOnlyPath = userSpecificPaths.some(p => path.startsWith(p)) || path === "/dashboard";

    if (isUserOnlyPath && userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);