import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Middleware för JazzCash-demo som skippar autentisering
export function middleware(request: NextRequest) {
  // Tillåt alla anrop utan autentisering för demo-versionen
  const url = request.nextUrl.clone();
  
  // Om användaren besöker roten, omdirigera till dashboard
  if (url.pathname === '/') {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Konfigurera vilka sidor som omfattas av middleware
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/dashboard",
    "/add-favourite/:path*",
    "/api/contacts/:path*",
    "/transfer/:path*",
    "/transfer"
  ]
}
