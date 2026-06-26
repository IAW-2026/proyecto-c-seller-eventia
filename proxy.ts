import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";
import { timingSafeEqual } from 'crypto';

const isProtectedRoute = createRouteMatcher(['/organizador(.*)', '/admin(.*)']);
// Rutas del seller que requieren API key
const isSellerApiRoute = createRouteMatcher(['/api/seller/:path*']);

export default clerkMiddleware(async (auth, request) => {
  // Valida API key antes de dejar pasar requests al seller
  if (isSellerApiRoute(request)) {
    const apiKey = request.headers.get("x-api-key");
    const expected = Buffer.from(process.env.SELLER_API_KEY ?? '');
    const received = Buffer.from(apiKey ?? '');
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
      return NextResponse.json({ error: "API key inválida" }, { status: 401 });
    }
  }

  // Protege las rutas del vendedor — redirige a /sign-in para que el forceRedirectUrl
  // de esa página garantice que el post-login siempre pase por /auth/redirect
  if (isProtectedRoute(request)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/(api|trpc)(.*)'],
};
