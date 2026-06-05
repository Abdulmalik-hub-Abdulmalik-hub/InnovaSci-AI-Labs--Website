import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const PROTECTED_ROLES = ["PUBLIC_VISITOR"];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if path is a dashboard route
    if (path.startsWith("/dashboard")) {
      // Block PUBLIC_VISITOR from dashboard routes
      if (token?.role && PROTECTED_ROLES.includes(token.role)) {
        return NextResponse.redirect(new URL("/login", req.url));
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
  matcher: ["/dashboard/:path*", "/api/:path*"],
};