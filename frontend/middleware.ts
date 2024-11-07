import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    // Custom middleware function
    function middleware(req) {
        // You can add custom logic here, for example:
        const url = req.nextUrl;
        const isAuth = req.nextauth.token;

        // Example: redirect if the user is authenticated but trying to access the login page
        if (isAuth && url.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
        // You can restrict certain routes based on session state
        authorized: ({ token }) => !!token, // Only allow access if token exists
        },
    },  
);

export const config = {
  matcher: ["/dashboard", "/search/:path*"], // Paths to apply the middleware to
};