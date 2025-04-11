// packages/auth/src/session.ts
import type { SessionOptions } from 'iron-session';

// Define session data structure - adjust based on your needs
export interface SessionData {
    userId: string; // UUID string
    isAdmin?: boolean; // Optional: For role checks within apps
    // Add other relevant session data: expiry? csrf token? name? email?
}

const thirtyDaysInSeconds = 30 * 24 * 60 * 60;

// Base options reusable for both apps
const baseCookieOptions: SessionOptions['cookieOptions'] = {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,                             // Prevent client-side JS access
    path: '/',                                  // Cookie accessible for all paths
    maxAge: undefined,                          // Default to session cookie unless ttl is set
};

// Function to get User App Session Options
export function getUserSessionOptions(): SessionOptions {
    const name = process.env.USER_SESSION_NAME;
    const secret = process.env.USER_SESSION_SECRET;

    if (!name) {
        console.warn("USER_SESSION_NAME environment variable is not set. Using default 'user_app_auth_session'.");
    }
    if (!secret || secret.length < 32) {
        console.error("CRITICAL: USER_SESSION_SECRET environment variable is not set or is too short (requires >= 32 chars)!");
        throw new Error("USER_SESSION_SECRET environment variable is not set or is too short!");
    }

    return {
        cookieName: name || 'user_app_auth_session',
        password: secret,
        ttl: 0, // Session cookie
        // ttl: thirtyDaysInSeconds, // Example: Use if you want persistent login for 30 days
        cookieOptions: {
            ...baseCookieOptions,
            sameSite: 'lax', // Good default for user-facing app
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
    if (secret === process.env.USER_SESSION_SECRET) {
        console.error("CRITICAL: ADMIN_SESSION_SECRET must be different from USER_SESSION_SECRET!");
        throw new Error("Admin and User session secrets cannot be the same!");
    }

    return {
        cookieName: name || 'admin_panel_auth_session',
        password: secret, // MUST BE DIFFERENT FROM USER SECRET
        ttl: 0, // Session cookie strongly recommended for admin
        cookieOptions: {
            ...baseCookieOptions,
            sameSite: 'strict', // Stricter setting recommended for admin panel
        },
    };
}