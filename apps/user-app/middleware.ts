// apps/user-app/middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth'; // Use shared config

const sessionOptions = getUserSessionOptions(); // Get user-specific options

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, including /api/auth/session)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login, register (public auth pages)
     * Publicly accessible pages like / or /tracks should be EXCLUDED from this matcher
     * if they are meant to be viewable by non-logged-in users.
     */
    // Example: Protect user-specific pages
     '/profile/:path*',
     '/collections/:path*', // Protect collection creation/editing/listing (if listing is user-specific)
     '/bookmarks/:path*',
     '/uploads/:path*', // Protect upload pages/process
     // Add other paths that strictly require login
  ],
};

export async function middleware(request: NextRequest) {
  const requestedPath = request.nextUrl.pathname;
  console.log(`User Middleware: Checking path: ${requestedPath}`);

  const response = NextResponse.next(); // Prepare response to potentially attach session headers
  try {
      const session = await getIronSession<SessionData>(request, response, sessionOptions);

      const { userId } = session;

      // If no userId in session, redirect to login preserving the intended destination
      if (!userId) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('next', requestedPath); // Pass intended destination
        console.log(`User Middleware: No userId found for protected path ${requestedPath}, redirecting to login.`);
        return NextResponse.redirect(loginUrl);
      }

      // User is logged in, allow request to proceed
      console.log(`User Middleware: userId ${userId} found for path ${requestedPath}, allowing.`);
      // Return the response object which might have session updates from getIronSession
      return response;

  } catch (error) {
       console.error(`User Middleware Error processing path ${requestedPath}:`, error);
       // Fallback: Redirect to login or show an error page? Redirecting is safer.
       const loginUrl = new URL('/login', request.url);
       loginUrl.searchParams.set('error', 'session_error');
       return NextResponse.redirect(loginUrl);
  }
}