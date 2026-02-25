import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("employee_token");

  console.log("Middleware check:", {
    pathname,
    hasToken: !!token,
    tokenValue: token?.value?.substring(0, 20) + "..."
  });

  // Allow login page
  if (pathname === "/login") {
    console.log("Login page - allowing access");
    return NextResponse.next();
  }

  // Redirect to login if no token
  if (!token) {
    console.log("No token found - redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("Token found - allowing access");
  return NextResponse.next();
}

export const config = {
  matcher: [
    
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};