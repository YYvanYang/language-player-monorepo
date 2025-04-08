// apps/admin-panel/app/api/auth/session/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession, SessionOptions } from 'iron-session';
// Assuming SessionData structure might be shared or similar enough
// If not shared, define AdminSessionData specifically here.
import type { SessionData } from '@repo/auth'; // Or define AdminSessionData locally

// --- Configure ADMIN Session Options ---
// !! IMPORTANT: Use DIFFERENT names and secrets than the user app !!
const adminSessionOptions: SessionOptions = {
  cookieName: process.env.ADMIN_SESSION_NAME || 'admin_panel_auth_session', // DIFFERENT Name
  password: process.env.ADMIN_SESSION_SECRET!, // DIFFERENT Secret - MUST be set in .env, complex, >= 32 chars
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
    sameSite: 'strict', // Use 'strict' for admin panel for better CSRF protection
    maxAge: undefined, // Session cookie (expires when browser closes) - Or set duration (e.g., 8 hours: 8 * 60 * 60)
    path: '/', // Ensure cookie applies to all admin panel paths
  },
};

// Environment variable check at startup
if (!adminSessionOptions.password) {
  console.error("FATAL ERROR: ADMIN_SESSION_SECRET environment variable is not set!");
  // In a real app, you might want to prevent startup if the secret is missing
  // For now, this will cause errors when getIronSession is called.
  // Consider adding a check in your build process or main app initialization.
}
// --- End Configuration ---

// GET handler to check current ADMIN session and admin status
export async function GET(request: NextRequest) {
  // Add explicit try-catch for robustness
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), adminSessionOptions);

    // Check for BOTH userId AND isAdmin flag for a valid admin session
    if (!session.userId || session.isAdmin !== true) {
      console.log("Admin Session GET: No valid admin session found.");
      // Destroy potentially incomplete session data if checks fail
      session.destroy();
      // Return a clear unauthorized status
      const response = NextResponse.json({ user: null, isAuthenticated: false, isAdmin: false }, { status: 401 });
      // Ensure cookie removal headers are set by iron-session during destroy
      await session.save(); // Need to save after destroy to send cookie removal header
      return response;

    }

    console.log(`Admin Session GET: Valid admin session found for userId: ${session.userId}`);
    // Return relevant session data, explicitly including isAdmin
    return NextResponse.json({
      // Only return necessary, non-sensitive info
      user: { id: session.userId /* add other safe fields if needed */ },
      isAuthenticated: true,
      isAdmin: session.isAdmin, // Return the admin status
    });

  } catch (error) {
      console.error("Admin Session GET Error:", error);
      // Return a generic server error if session handling fails unexpectedly
      return NextResponse.json({ message: "Failed to retrieve session information." }, { status: 500 });
  }
}

// POST handler to create/update ADMIN session (called after successful backend ADMIN login/auth)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId as string;
    // **Crucially, expect and require the 'isAdmin' flag from the caller (Admin Login Server Action)**
    const isAdmin = body.isAdmin === true; // Explicitly check for true boolean

    if (!userId) {
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }
    // **Require the caller (Admin Login Action) to confirm the user IS an admin**
    if (!isAdmin) {
      console.warn(`Admin Session POST: Attempt to set session without isAdmin flag for userId: ${userId}`);
      return NextResponse.json({ message: 'Admin status confirmation is required to create admin session' }, { status: 403 }); // Forbidden
    }

    const session = await getIronSession<SessionData>(request, NextResponse.next(), adminSessionOptions);

    // Store essential admin session data
    session.userId = userId;
    session.isAdmin = true; // Set the admin flag in the session

    await session.save(); // Encrypts and sets the cookie in the response

    console.log(`Admin Session POST: Session saved for admin userId: ${session.userId}`);
    // Return confirmation
    return NextResponse.json({ ok: true, userId: session.userId, isAdmin: session.isAdmin });

  } catch (error) {
    console.error("Admin Session POST Error:", error);
    const message = error instanceof Error ? error.message : "Failed to set admin session";
    return NextResponse.json({ message }, { status: 500 });
  }
}

// DELETE handler to destroy ADMIN session (logout)
export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({ ok: true }); // Prepare response first
    const session = await getIronSession<SessionData>(request, response, adminSessionOptions);
    session.destroy(); // Clears session data and sets cookie removal headers via iron-session's save on destroy

    console.log("Admin Session DELETE: Session destroyed.");
    return response; // Return the response with cookie headers set by iron-session

  } catch (error) {
    console.error("Admin Session DELETE Error:", error);
    const message = error instanceof Error ? error.message : "Failed to destroy admin session";
    return NextResponse.json({ message }, { status: 500 });
  }
}