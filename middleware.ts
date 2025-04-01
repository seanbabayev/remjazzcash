import { withAuth } from "next-auth/middleware"

// Middleware kommer att köras på alla routes som matchar detta mönster
export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token // Kräv att användaren är inloggad
  },
})

// Konfigurera vilka sidor som kräver autentisering
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard",
    "/add-favourite/:path*",
    "/api/contacts/:path*",
    "/transfer/:path*",
    "/transfer"
  ]
}
