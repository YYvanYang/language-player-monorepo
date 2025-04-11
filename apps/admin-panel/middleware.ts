// apps/admin-panel/middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, getAdminSessionOptions } from '@repo/auth'; // Use shared config and admin options

const adminSessionOptions = getAdminSessionOptions();

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, including /api/auth/session)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (public admin login page)
     */
     // This protects all routes under '/' including the dashboard, users, tracks etc.
     // EXCEPT the ones explicitly excluded above (like /login)
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next(); // Prepare default response
  const requestedPath = request.nextUrl.pathname;

  try {
    const session = await getIronSession<SessionData>(request, response, adminSessionOptions);
    const { userId, isAdmin } = session;

    // Check for BOTH userId AND isAdmin flag being explicitly true
    if (!userId || isAdmin !== true) {
      const loginUrl = new URL('/login', request.url);
      console.log(`Admin Middleware: No valid admin session for path ${requestedPath}, redirecting to login.`);
      // Destroy potentially invalid session data
      session.destroy();
      // Redirect to login - note: modifying response after redirect might not set cookie header correctly
      // It's better to destroy session and then redirect. Iron-session handles setting removal cookie on destroy+save.
      await session.save(); // Save destruction to set cookie header
      return NextResponse.redirect(loginUrl);
    }

    // Admin user is logged in and has the flag, allow request
    // console.log(`Admin Middleware: Valid admin session (userId ${userId}) for path ${requestedPath}, allowing.`);
    return response; // Allow request, response might have session attached if needed later

  } catch (error) {
       console.error(`Admin Middleware Error processing path ${requestedPath}:`, error);
       // Fallback: Redirect to login on session handling error
       const loginUrl = new URL('/login', request.url);
       loginUrl.searchParams.set('error', 'session_error');
       // Cannot easily clear cookie here on error, redirect is the main action
       return NextResponse.redirect(loginUrl);
  }
}