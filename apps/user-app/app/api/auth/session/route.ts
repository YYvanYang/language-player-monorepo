// apps/user-app/app/api/auth/session/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth'; // Use shared config

const sessionOptions = getUserSessionOptions(); // Get user-specific options

/**
 * GET /api/auth/session
 * Checks if a valid user session exists and returns basic user info.
 */
export async function GET(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  try {
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    if (!session.userId) {
      // console.log("User Session GET: No userId found.");
      return NextResponse.json({ user: null, isAuthenticated: false }, { status: 200 });
    }

    // console.log(`User Session GET: Valid session for userId ${session.userId}`);
    return NextResponse.json({
      user: { id: session.userId }, // Only return ID needed by AuthContext
      isAuthenticated: true,
    }, { status: 200 }); // Explicitly set status 200

  } catch (error) {
      console.error("User Session GET Error:", error);
      // Ensure a response is always sent, even on error
      return NextResponse.json({ message: "Failed to retrieve user session." }, { status: 500 });
  }
}

/**
 * POST /api/auth/session
 * Creates or updates the user session after successful login/registration.
 * Called securely ONLY by Server Actions within this app.
 */
export async function POST(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  try {
    const body = await request.json();
    const userId = body.userId as string;

    if (!userId) {
      console.warn("User Session POST: userId is required.");
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }

    // Add basic validation if desired (e.g., UUID format)

    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    session.userId = userId;
    delete session.isAdmin; // Ensure admin flag isn't carried over if reusing SessionData type
    await session.save();

    // console.log(`User Session POST: Session saved successfully for userId ${session.userId}`);
    return NextResponse.json({ ok: true, userId: session.userId }, { status: 200 });

  } catch (error) {
    console.error("User Session POST Error:", error);
    const message = error instanceof Error ? error.message : "Failed to set user session";
    return NextResponse.json({ message }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/session
 * Destroys the current user session (logout).
 * Called securely ONLY by Server Actions within this app.
 */
export async function DELETE(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  try {
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    session.destroy();

    console.log("User Session DELETE: Session destroyed.");
    // The Set-Cookie header to clear the cookie is added to 'response' by session.destroy/save implicitly
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("User Session DELETE Error:", error);
    const message = error instanceof Error ? error.message : "Failed to destroy user session";
    return NextResponse.json({ message }, { status: 500 });
  }
}