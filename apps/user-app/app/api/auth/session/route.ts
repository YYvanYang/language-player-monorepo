// apps/user-app/app/api/auth/session/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth'; // Use shared config

const sessionOptions = getUserSessionOptions(); // Get user-specific options

/**
 * GET /api/auth/session
 * Checks if a valid user session exists and returns basic user info (ID only).
 * Used by AuthContext to check client-side auth state.
 */
export async function GET(request: NextRequest) {
  console.log("GET /api/auth/session: Received request");
  // Response must be constructed BEFORE accessing session if using Route Handler context
  const response = NextResponse.json({ user: null, isAuthenticated: false });
  try {
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    console.log("GET /api/auth/session: Iron session obtained.");

    // Explicitly log the userId found (or not found)
    console.log("GET /api/auth/session: Session userId found:", session.userId);
    console.log("GET /api/auth/session: Session isAdmin found:", session.isAdmin); // Should be undefined/null here
    console.log("GET /api/auth/session: Session encryptedAccessToken found:", session.encryptedAccessToken ? 'Yes' : 'No');

    if (!session.userId) {
      console.log("GET /api/auth/session: No userId found in session. Responding unauthenticated.");
      // console.log("User Session GET: No userId found.");
      // No need to explicitly return 401, just return unauthenticated state
      // Session cookie might be cleared/expired, client needs to know they aren't logged in.
      return NextResponse.json({ user: null, isAuthenticated: false });
    }

    console.log(`GET /api/auth/session: Valid session found for userId ${session.userId}. Responding authenticated.`);
    // User has a valid session according to the cookie
    // console.log(`User Session GET: Valid session found for userId ${session.userId}`);
    return NextResponse.json({
      user: { id: session.userId }, // Only return non-sensitive ID
      isAuthenticated: true,
    });

  } catch (error) {
      console.error("GET /api/auth/session: Error during session processing:", error);
      // Return a generic server error if session handling fails unexpectedly
      return NextResponse.json({ message: "Failed to retrieve session information." }, { status: 500 });
  }
}

/**
 * POST /api/auth/session
 * Creates or updates the user session after successful login/registration/callback.
 * Should ONLY be called securely by Server Actions within this app.
 */
export async function POST(request: NextRequest) {
  // Response must be constructed BEFORE accessing session
  const response = NextResponse.json({ ok: false }); // Default to failure
  try {
    const body = await request.json();
    const userId = body.userId as string;

    if (!userId) {
      console.warn("User Session POST: userId is required.");
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }

    // Basic UUID validation could be added here if desired

    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    session.userId = userId;
    // Ensure admin flag is NEVER set for regular user sessions
    delete session.isAdmin;
    await session.save();

    // console.log(`User Session POST: Session saved successfully for userId ${session.userId}`);
    // Return success with the user ID confirmed in session
    return NextResponse.json({ ok: true, userId: session.userId });

  } catch (error) {
    console.error("User Session POST Error:", error);
    const message = error instanceof Error ? error.message : "Failed to set user session";
    return NextResponse.json({ message }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/session
 * Destroys the current user session (logout).
 * Should ONLY be called securely by Server Actions within this app.
 */
export async function DELETE(request: NextRequest) {
  // Prepare response first, session destroy will add headers to it
  const response = NextResponse.json({ ok: true });
  try {
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    await session.destroy(); // Clears session data and sets cookie removal headers

    console.log("User Session DELETE: Session destroyed.");
    return response; // Return the response with cookie headers set by iron-session

  } catch (error) {
    console.error("User Session DELETE Error:", error);
    const message = error instanceof Error ? error.message : "Failed to destroy user session";
    return NextResponse.json({ message }, { status: 500 });
  }
}