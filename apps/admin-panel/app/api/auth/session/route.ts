// apps/admin-panel/app/api/auth/session/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { getIronSession, SessionOptions } from 'iron-session';
// Assuming SessionData is exported from the shared package or defined here
import type { SessionData } from '@repo/auth'; // Or define locally if not shared

// --- Configure Session Options ---
// !! IMPORTANT: Use different names and secrets for User vs Admin !!
const sessionOptions: SessionOptions = {
  cookieName: process.env.ADMIN_SESSION_NAME || 'admin_panel_auth_session', // App-specific name
  password: process.env.ADMIN_SESSION_SECRET!, // MUST be set in .env.local/.env.production, complex, >= 32 chars
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
    sameSite: 'lax', // Recommended default
    maxAge: undefined, // Session cookie (expires when browser closes) or set duration
    // path: '/', // Default is root
  },
};
if (!sessionOptions.password) {
  throw new Error("ADMIN_SESSION_SECRET environment variable is not set!");
}
// --- End Configuration ---

// GET handler to check current session
export async function GET(request: NextRequest) {
  const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);

  if (!session.userId) {
    return NextResponse.json({ user: null, isAuthenticated: false }, { status: 401 });
  }

  // Return relevant (non-sensitive) session data
  return NextResponse.json({
    user: { id: session.userId, isAdmin: session.isAdmin /*, add other needed fields like name/role if stored */ },
    isAuthenticated: true,
  });
}

// POST handler to create/update session (called after successful backend login/auth)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId as string; // Expecting userId from the caller (e.g., Server Action)
    const isAdmin = body.isAdmin as boolean | undefined; // Optional admin flag

    if (!userId) {
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }

    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);

    // Update session data
    session.userId = userId;
    session.isAdmin = isAdmin; // Store admin flag if provided

    await session.save(); // Encrypts and sets the cookie in the response

    return NextResponse.json({ ok: true, userId: session.userId }); // Confirm session save

  } catch (error) {
    console.error("Error setting session:", error);
    const message = error instanceof Error ? error.message : "Failed to set session";
    return NextResponse.json({ message }, { status: 500 });
  }
}

// DELETE handler to destroy session (logout)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(request, NextResponse.next(), sessionOptions);
    session.destroy(); // Clears session data and removes cookie

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error destroying session:", error);
    const message = error instanceof Error ? error.message : "Failed to destroy session";
    return NextResponse.json({ message }, { status: 500 });
  }
}