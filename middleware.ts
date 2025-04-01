import { withAuth } from "next-auth/middleware"

// Middleware kommer att köras på alla routes som matchar detta mönster
export default withAuth({
  callbacks: {
    authorized: ({ token }) => true // Tillåt alla requests
  },
})

// Konfigurera vilka sidor som kräver autentisering
export const config = {
  matcher: [
    // "/dashboard/:path*",
    // "/add-favourite/:path*",
    // "/api/contacts/:path*",
    // "/transfer/:path*",
    // "/transfer"
  ]
}
