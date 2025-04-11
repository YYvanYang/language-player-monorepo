// packages/auth/src/session.ts (Refined)
import type { SessionOptions } from 'iron-session';

// Define session data structure - adjust based on your needs
export interface SessionData {
    userId: string; // UUID string
    isAdmin?: boolean; // Crucial for Admin Panel
    // Add other relevant session data: expiry? csrf token? name? email?
}

// Function to get User App Session Options
export function getUserSessionOptions(): SessionOptions {
    const name = process.env.USER_SESSION_NAME;
    const secret = process.env.USER_SESSION_SECRET;

    if (!name) {
        console.warn("USER_SESSION_NAME environment variable is not set. Using default 'user_app_auth_session'.");
    }
    if (!secret || secret.length < 32) {
        // Throwing an error might be better in production to prevent startup with weak secrets
        console.error("CRITICAL: USER_SESSION_SECRET environment variable is not set or is too short (requires >= 32 chars)!");
        throw new Error("USER_SESSION_SECRET environment variable is not set or is too short!");
    }

    return {
        cookieName: name || 'user_app_auth_session',
        password: secret,
        ttl: 0, // 0 = session cookie (expires when browser closes). Set > 0 for persistent cookies (in seconds).
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            httpOnly: true,                             // Prevent client-side JS access
            sameSite: 'lax',                            // Good default for most cases
            maxAge: undefined,                          // Let ttl handle expiry if set, otherwise session cookie
            path: '/',                                  // Cookie accessible for all paths
        },
    };
}

// Function to get Admin Panel Session Options
export function getAdminSessionOptions(): SessionOptions {
    const name = process.env.ADMIN_SESSION_NAME;
    const secret = process.env.ADMIN_SESSION_SECRET;

    if (!name) {
        console.warn("ADMIN_SESSION_NAME environment variable is not set. Using default 'admin_panel_auth_session'.");
    }
    if (!secret || secret.length < 32) {
        console.error("CRITICAL: ADMIN_SESSION_SECRET environment variable is not set or is too short (requires >= 32 chars)!");
        throw new Error("ADMIN_SESSION_SECRET environment variable is not set or is too short!");
    }

    return {
        cookieName: name || 'admin_panel_auth_session',
        password: secret, // MUST BE DIFFERENT FROM USER SECRET
        ttl: 0, // Session cookie recommended for admin
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'strict', // Stricter setting for admin panel
            maxAge: undefined,
            path: '/',
        },
    };
}