// packages/auth/src/session.ts
import type { SessionOptions } from 'iron-session';

// Define shared session data structure
export interface SessionData {
    userId?: string; // Store as string (UUID)
    isAdmin?: boolean; // Explicitly track admin status in session
    // Add other fields if needed, e.g., csrfToken: string;
}

// Recommended: Use environment variables for secrets and names
const DEFAULT_USER_SESSION_NAME = 'user_app_auth_session';
const DEFAULT_ADMIN_SESSION_NAME = 'admin_panel_auth_session';
const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;

// Base cookie options
const baseCookieOptions: SessionOptions['cookieOptions'] = {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    path: '/',
    maxAge: undefined, // Default to session cookie (expires on browser close)
};

// Function to get User App Session Options
export function getUserSessionOptions(): SessionOptions {
    const name = process.env.USER_SESSION_NAME || DEFAULT_USER_SESSION_NAME;
    const secret = process.env.USER_SESSION_SECRET;

    if (!secret || secret.length < 32) {
        console.error("CRITICAL SECURITY WARNING: USER_SESSION_SECRET environment variable is missing, too short (< 32 chars), or not loaded correctly! Session encryption will fail.");
        // Optionally throw an error in production builds
        // if (process.env.NODE_ENV === 'production') {
        //     throw new Error("USER_SESSION_SECRET environment variable is not configured correctly.");
        // }
        // For development, proceed with a warning but expect errors.
    }

    return {
        cookieName: name,
        password: secret || "fallback-insecure-user-secret-for-dev-only-32-chars", // Provide insecure fallback ONLY for dev if var missing
        ttl: 0, // Session cookie (0 means session expires when browser closes)
        // ttl: THIRTY_DAYS_IN_SECONDS, // Uncomment for persistent login (e.g., 30 days)
        cookieOptions: {
            ...baseCookieOptions,
            sameSite: 'lax', // 'lax' is a good default for user apps
        },
    };
}

// Function to get Admin Panel Session Options
export function getAdminSessionOptions(): SessionOptions {
    const name = process.env.ADMIN_SESSION_NAME || DEFAULT_ADMIN_SESSION_NAME;
    const secret = process.env.ADMIN_SESSION_SECRET;
    const userSecret = process.env.USER_SESSION_SECRET;

    if (!secret || secret.length < 32) {
         console.error("CRITICAL SECURITY WARNING: ADMIN_SESSION_SECRET environment variable is missing, too short (< 32 chars), or not loaded correctly! Session encryption will fail.");
        // Optionally throw an error in production builds
    }
    if (secret && userSecret && secret === userSecret) {
         console.error("CRITICAL SECURITY WARNING: ADMIN_SESSION_SECRET must be DIFFERENT from USER_SESSION_SECRET!");
        // Optionally throw an error
    }

    return {
        cookieName: name,
        password: secret || "fallback-insecure-admin-secret-for-dev-only-32-chars", // Provide insecure fallback ONLY for dev
        ttl: 0, // Session cookie strongly recommended for admin panels
        cookieOptions: {
            ...baseCookieOptions,
            sameSite: 'strict', // Stricter setting for admin panel
        },
    };
}