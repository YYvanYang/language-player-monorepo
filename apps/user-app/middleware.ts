// apps/user-app/middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth'; // Use shared config

const sessionOptions = getUserSessionOptions();

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, including /api/auth/session)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login, register (public auth pages)
     * - tracks$ (allow public listing of tracks, but not specific actions)
     * - collections$ (allow public listing of collections, but not specific actions)
     * Publicly accessible pages like / or /tracks/{id} should be EXCLUDED from this matcher
     * if they are meant to be viewable by non-logged-in users.
     */
    // Example: Protect user-specific pages and creation pages
     '/profile/:path*',
     '/collections/new', // Protect creation page
     '/collections/edit/:path*', // Protect editing
     '/bookmarks/:path*',
     '/upload', // Example upload page
     // Add other paths that strictly require login
     // '/collections$', // Protect the user's collection list if not public
     // '/tracks$', // If track listing has user-specific filters/views
  ],
};

export async function middleware(request: NextRequest) {
  const requestedPath = request.nextUrl.pathname;
  // console.log(`User Middleware: Checking path: ${requestedPath}`);

  const response = NextResponse.next();
  try {
      const session = await getIronSession<SessionData>(request, response, sessionOptions);
      const { userId } = session;

      if (!userId) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('next', requestedPath);
        // console.log(`User Middleware: No userId found for protected path ${requestedPath}, redirecting to login.`);
        return NextResponse.redirect(loginUrl);
      }

      // console.log(`User Middleware: userId ${userId} found for path ${requestedPath}, allowing.`);
      return response; // Allow request, session might be attached to response

  } catch (error) {
       console.error(`User Middleware Error processing path ${requestedPath}:`, error);
       // Fallback: Redirect to login on session error
       const loginUrl = new URL('/login', request.url);
       loginUrl.searchParams.set('error', 'session_error');
       return NextResponse.redirect(loginUrl);
  }
}