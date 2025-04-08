// apps/admin-panel/middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import type { SessionData } from '@repo/auth'; // Adjust import

const adminSessionOptions = { /* PASTE ADMIN SESSION OPTIONS HERE (DIFFERENT NAME/SECRET) */
    cookieName: process.env.ADMIN_SESSION_NAME || 'admin_panel_auth_session',
    password: process.env.ADMIN_SESSION_SECRET!,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production', httpOnly: true, sameSite: 'strict', maxAge: undefined, // Use strict for admin
    },
};

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)', // Protect everything except login and internal paths
     '/', // Protect root dashboard
  ],
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, adminSessionOptions);

  const { userId, isAdmin } = session;
  const requestedPath = request.nextUrl.pathname;

  // Check for BOTH userId and isAdmin flag
  if (!userId || !isAdmin) {
    const loginUrl = new URL('/login', request.url);
    // Don't need to preserve 'next' param typically for admin panel
    console.log(`Admin Middleware: No valid admin session for path ${requestedPath}, redirecting to login.`);
    return NextResponse.redirect(loginUrl);
  }

  // Admin user is logged in, allow request
  console.log(`Admin Middleware: Valid admin session (userId ${userId}) for path ${requestedPath}, allowing.`);
  return response;
}