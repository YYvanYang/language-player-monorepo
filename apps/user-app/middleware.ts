// apps/user-app/middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth'; // Use shared config

const sessionOptions = getUserSessionOptions();

export const config = {
  matcher: [
    /*
     * Define paths that REQUIRE authentication.
     * Public pages like landing page ('/'), public track/collection lists ('/tracks', '/collections'),
     * and individual track/collection details should NOT be listed here
     * if they can be viewed by non-logged-in users.
     */
    '/profile/:path*', // User profile pages
    '/collections/new', // Creating new collections
    '/collections/:collectionId/edit', // Editing collections (dynamic path)
    '/bookmarks', // Viewing bookmarks list
    '/upload', // Upload page
    // Add other paths that strictly require login
    // Example: '/settings/:path*'
  ],
};

export async function middleware(request: NextRequest) {
  const requestedPath = request.nextUrl.pathname;
  const response = NextResponse.next(); // Prepare default response

  try {
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    const { userId } = session;

    // If accessing a protected route without a userId in the session, redirect to login
    if (!userId) {
      const loginUrl = new URL('/login', request.url);
      // Preserve the originally requested URL to redirect back after login
      loginUrl.searchParams.set('next', requestedPath + request.nextUrl.search);
      console.log(`User Middleware: No userId for protected path ${requestedPath}, redirecting to login.`);
      // Clear potentially invalid session cookie? Optional.
      // session.destroy(); await session.save(); // Could add this, but redirect is primary action
      return NextResponse.redirect(loginUrl);
    }

    // User has a valid session, allow the request
    // console.log(`User Middleware: Valid session (userId ${userId}) for protected path ${requestedPath}, allowing.`);
    // Important: Attach session data to the response if needed by subsequent handlers/pages using headers
    // response.headers.set('x-user-id', userId); // Example (Not typically needed with App Router server context)
    return response;

  } catch (error) {
       console.error(`User Middleware Error processing path ${requestedPath}:`, error);
       // Fallback: Redirect to login on session handling error
       const loginUrl = new URL('/login', request.url);
       loginUrl.searchParams.set('error', 'session_error');
       // Cannot reliably clear cookie here on error
       return NextResponse.redirect(loginUrl);
  }
}