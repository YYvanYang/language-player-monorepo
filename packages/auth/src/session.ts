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
// const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60; // Example for persistent login TTL

// Base cookie options
const baseCookieOptions: SessionOptions['cookieOptions'] = {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    path: '/',
    // REMOVED maxAge: undefined - use ttl: 0 for session cookies
};

// Function to get User App Session Options
export function getUserSessionOptions(): SessionOptions {
    const name = process.env.USER_SESSION_NAME || DEFAULT_USER_SESSION_NAME;
    const secret = process.env.USER_SESSION_SECRET;

    // --- CRITICAL CHECK ---
    if (!secret || secret.length < 32) {
        const message = "FATAL SECURITY WARNING: USER_SESSION_SECRET environment variable is missing or less than 32 characters long! Session encryption is compromised.";
        console.error("\n" + "*".repeat(message.length) + "\n" + message + "\n" + "*".repeat(message.length) + "\n");
        if (process.env.NODE_ENV === 'production') {
            throw new Error("USER_SESSION_SECRET environment variable is not configured correctly.");
        }
    }
    // --- END CHECK ---

    return {
        cookieName: name,
        password: secret || "fallback-insecure-user-secret-for-dev-only-32-chars", // Fallback ONLY for dev
        ttl: 0, // Session cookie (expires when browser closes)
        // ttl: THIRTY_DAYS_IN_SECONDS, // Uncomment for persistent login
        cookieOptions: {
            ...baseCookieOptions,
            sameSite: 'lax', // Good default for user apps
        },
    };
}

// Function to get Admin Panel Session Options
export function getAdminSessionOptions(): SessionOptions {
    const name = process.env.ADMIN_SESSION_NAME || DEFAULT_ADMIN_SESSION_NAME;
    const secret = process.env.ADMIN_SESSION_SECRET;
    const userSecret = process.env.USER_SESSION_SECRET;

    // --- CRITICAL CHECKS ---
    if (!secret || secret.length < 32) {
         const message = "FATAL SECURITY WARNING: ADMIN_SESSION_SECRET environment variable is missing or less than 32 characters long! Session encryption is compromised.";
         console.error("\n" + "*".repeat(message.length) + "\n" + message + "\n" + "*".repeat(message.length) + "\n");
        if (process.env.NODE_ENV === 'production') {
            throw new Error("ADMIN_SESSION_SECRET environment variable is not configured correctly.");
        }
    }
    if (secret && userSecret && secret === userSecret) {
         const message = "FATAL SECURITY WARNING: ADMIN_SESSION_SECRET must be DIFFERENT from USER_SESSION_SECRET!";
         console.error("\n" + "*".repeat(message.length) + "\n" + message + "\n" + "*".repeat(message.length) + "\n");
         if (process.env.NODE_ENV === 'production') {
             throw new Error("Admin and User session secrets cannot be the same.");
         }
    }
    // --- END CHECKS ---

    return {
        cookieName: name,
        password: secret || "fallback-insecure-admin-secret-for-dev-only-32-chars", // Fallback ONLY for dev
        ttl: 0, // Session cookie strongly recommended for admin panels
        cookieOptions: {
            ...baseCookieOptions,
            sameSite: 'strict', // Stricter setting for admin panel
        },
    };
}