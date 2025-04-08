// apps/user-app/app/api/auth/session/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession, SessionOptions } from 'iron-session';
import type { SessionData } from '@repo/auth'; 

// --- Configure Session Options ---
// !! IMPORTANT: Use UNIQUE names and secrets per app !!
const sessionOptions: SessionOptions = {
  cookieName: process.env.USER_SESSION_NAME || 'user_app_auth_session', // App-specific name
  password: process.env.USER_SESSION_SECRET!, // MUST be set in .env*, complex, >= 32 chars
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,                             // Prevent client-side JS access
    sameSite: 'lax',                            // Good default for most cases
    maxAge: undefined,                          // Session cookie (expires when browser closes)
    path: '/',                                  // Cookie accessible for all paths
  },
};
if (!sessionOptions.password || sessionOptions.password.length < 32) {
  console.error("CRITICAL: USER_SESSION_SECRET environment variable is not set or is too short (requires >= 32 chars)!");
  // Optional: throw an error during build/startup in production if secret is missing/weak
  // throw new Error("USER_SESSION_SECRET environment variable is not set or is too short!");
}
// --- End Configuration ---

/**
 * GET /api/auth/session
 * Checks if a valid session exists and returns basic user info.
 * Used by AuthContext on client-side load and potentially middleware server-side.
 */
export async function GET(request: NextRequest) {
  // Pass dummy response for type checking, actual response generated later
  const response = new NextResponse();
  const session = await getIronSession<SessionData>(request, response, sessionOptions);

  if (!session.userId) {
    console.log("Session GET: No userId found in session.");
    return NextResponse.json({ user: null, isAuthenticated: false }, { status: 200 }); // Return 200 OK, but indicate not authenticated
  }

  console.log(`Session GET: Valid session found for userId ${session.userId}`);
  // Return relevant (non-sensitive) session data
  // Avoid returning the session cookie itself or sensitive details
  return NextResponse.json({
    user: { id: session.userId }, // Return only ID for AuthContext
    isAuthenticated: true,
  });
}

/**
 * POST /api/auth/session
 * Creates or updates the user session after successful login/registration.
 * Called securely by Server Actions.
 */
export async function POST(request: NextRequest) {
  // Pass dummy response for type checking, actual response generated later
  const response = new NextResponse();
  try {
    const body = await request.json();
    const userId = body.userId as string; // Expecting userId from the caller Server Action

    if (!userId) {
      console.warn("Session POST: userId is required in request body.");
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }

    // Validate userId format if possible (e.g., is it a valid UUID?)
    // Could use uuid.parse() here

    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    // Update session data
    session.userId = userId;
    // Clear any previous admin flag if structure was reused (shouldn't happen with separate cookies)
    // delete session.isAdmin;

    await session.save(); // Encrypts and prepares the Set-Cookie header for the response

    console.log(`Session POST: Session saved successfully for userId ${session.userId}`);
    // The actual cookie is set via the headers on the 'response' object passed to getIronSession
    return NextResponse.json({ ok: true, userId: session.userId }); // Confirm session save

  } catch (error) {
    console.error("Session POST Error:", error);
    const message = error instanceof Error ? error.message : "Failed to set session";
    return NextResponse.json({ message }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/session
 * Destroys the current session (logout).
 * Called securely by Server Actions.
 */
export async function DELETE(request: NextRequest) {
  // Pass dummy response for type checking, actual response generated later
  const response = new NextResponse();
  try {
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    session.destroy(); // Clears session data and prepares Set-Cookie header to remove cookie

    console.log("Session DELETE: Session destroyed (logout).");
    return NextResponse.json({ ok: true }); // Confirm logout
  } catch (error) {
    console.error("Session DELETE Error:", error);
    const message = error instanceof Error ? error.message : "Failed to destroy session";
    return NextResponse.json({ message }, { status: 500 });
  }
}