// apps/user-app/middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import type { SessionData } from '@repo/auth'; // Adjust import

const sessionOptions = { /* PASTE USER SESSION OPTIONS HERE or import from shared */
    cookieName: process.env.USER_SESSION_NAME || 'user_app_auth_session',
    password: process.env.USER_SESSION_SECRET!,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production', httpOnly: true, sameSite: 'lax', maxAge: undefined,
    },
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login, register (public auth pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
    '/', // Match the root path specifically if it should be protected
  ],
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next(); // Prepare response to potentially attach session
  const session = await getIronSession<SessionData>(request, response, sessionOptions);

  const { userId } = session;
  const requestedPath = request.nextUrl.pathname;

  if (!userId) {
    // User is not logged in, redirect to login page preserving the requested URL
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', requestedPath); // Pass intended destination
    console.log(`Middleware: No userId found for path ${requestedPath}, redirecting to login.`);
    return NextResponse.redirect(loginUrl);
  }

  // User is logged in, allow request to proceed
  console.log(`Middleware: userId ${userId} found for path ${requestedPath}, allowing.`);
  // The response object with potentially updated session data (if getIronSession modifies it)
  // needs to be returned for the session handling to work correctly.
  return response;
}