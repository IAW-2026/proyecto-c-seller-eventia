import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(['/vendedor(.*)']);
// Rutas del seller que requieren API key
const isSellerApiRoute = createRouteMatcher(['/api/seller/:path*']);

export default clerkMiddleware(async (auth, request) => {
  // Valida API key antes de dejar pasar requests al seller
  if (isSellerApiRoute(request)) {
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== process.env.SELLER_API_KEY) {
      return NextResponse.json({ error: "API key inválida" }, { status: 401 });
    }
  }

  // Protege las rutas del vendedor con autenticación de Clerk
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/(api|trpc)(.*)'],
};
