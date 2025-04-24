// apps/user-app/_lib/server-utils.ts
// IMPORTANT: This file contains server-only logic (Node.js crypto)
// Ensure this file is ONLY imported and used in server-side contexts (Server Actions, API Routes, RSC)

import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { SessionData, getUserSessionOptions } from '@repo/auth';
import logger from '@repo/logger'; // Use shared logger
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { Buffer } from 'buffer'; // Import Buffer explicitly

// Logger specific to this module
const serverUtilsLogger = logger.child({ module: 'server-utils' });

// Encryption algorithm
const alg = 'aes-256-cbc';

// --- Cached Derived Key ---
// Memoize the key derivation for efficiency within a single request/process lifespan
let derivedKey: Buffer | null = null;
let keyDerivationError: Error | null = null;

/**
 * Derives or retrieves the cached encryption key from environment variables.
 * Logs errors if environment variables are missing or derivation fails.
 * @returns The derived key as a Buffer, or null if an error occurred.
 */
function getEncryptionKey(): Buffer | null {
    // Return cached key or error immediately if already processed
    if (derivedKey) return derivedKey;
    if (keyDerivationError) {
        serverUtilsLogger.error("Re-throwing previous key derivation error.");
        return null;
    }

    const encryptionPassword = process.env.ACCESS_TOKEN_ENCRYPTION_KEY;
    const salt = process.env.ACCESS_TOKEN_ENCRYPTION_SALT;

    // --- Validate Environment Variables ---
    if (!encryptionPassword) {
        keyDerivationError = new Error("Security Error: ACCESS_TOKEN_ENCRYPTION_KEY environment variable is not set!");
        serverUtilsLogger.error(keyDerivationError.message);
        return null;
    }
    if (!salt) {
        keyDerivationError = new Error("Security Error: ACCESS_TOKEN_ENCRYPTION_SALT environment variable is not set!");
        serverUtilsLogger.error(keyDerivationError.message);
        return null;
    }
     if (encryptionPassword.length < 32) {
         serverUtilsLogger.warn("Security Warning: ACCESS_TOKEN_ENCRYPTION_KEY should ideally be at least 32 characters long for stronger entropy.");
     }

    // --- Derive Key using Scrypt ---
    try {
        // scrypt is CPU/memory intensive, suitable for key derivation
        // Args: password, salt, keylength (32 bytes for AES-256)
        derivedKey = scryptSync(encryptionPassword, salt, 32);
        serverUtilsLogger.info("Encryption key derived successfully using scrypt.");
        return derivedKey;
    } catch (error) {
        keyDerivationError = error instanceof Error ? error : new Error(String(error));
        serverUtilsLogger.error({ error: keyDerivationError }, "Failed to derive encryption key using scrypt");
        return null;
    }
}

// --- Encryption Function ---
/**
 * Encrypts a plaintext token using AES-256-CBC.
 * Prepends the hex-encoded IV to the hex-encoded ciphertext, separated by ':'.
 * @param token - The plaintext token string to encrypt.
 * @returns The IV:Ciphertext string (hex encoded), or null on failure.
 */
export function encryptToken(token: string): string | null {
    const key = getEncryptionKey();
    if (!key) {
        serverUtilsLogger.error("Encryption failed: Cannot get encryption key.");
        return null;
    }

    try {
        const iv = randomBytes(16); // Generate a unique 16-byte IV for CBC mode
        const cipher = createCipheriv(alg, key, iv);
        let encrypted = cipher.update(token, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const result = iv.toString('hex') + ':' + encrypted;
        serverUtilsLogger.debug("Token encrypted successfully."); // Avoid logging sensitive data
        return result;
    } catch (error) {
        serverUtilsLogger.error({ error }, "Encryption process failed");
        return null;
    }
}

// --- Decryption Function ---
/**
 * Decrypts an IV:Ciphertext string (hex encoded) using AES-256-CBC.
 * @param encryptedToken - The encrypted token string (IV:Ciphertext, hex encoded).
 * @returns The original plaintext token string, or null if decryption fails or input is invalid.
 */
export function decryptToken(encryptedToken: string | undefined | null): string | null {
    if (!encryptedToken) {
        // serverUtilsLogger.debug("Decryption skipped: No encrypted token provided."); // Reduce noise
        return null;
    }

    const key = getEncryptionKey();
    if (!key) {
         serverUtilsLogger.error("Decryption skipped: Encryption key is unavailable.");
        return null;
    }

    try {
        const parts = encryptedToken.split(':');
        if (parts.length !== 2) {
            serverUtilsLogger.error({ format: encryptedToken.substring(0,10)+"..." }, "Decryption Error: Invalid encrypted token format (missing IV separator).");
            return null;
        }

        const iv = Buffer.from(parts[0], 'hex');
        const encryptedText = parts[1];

        if (iv.length !== 16) {
             serverUtilsLogger.error({ ivLength: iv.length }, "Decryption Error: Invalid IV length detected.");
             return null;
        }
        if (!encryptedText || encryptedText.length === 0) {
             serverUtilsLogger.error("Decryption Error: Encrypted text part is missing.");
             return null;
        }

        const decipher = createDecipheriv(alg, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        // serverUtilsLogger.debug("Token decrypted successfully."); // Avoid logging sensitive data
        return decrypted;
    } catch (error) {
        // Log specific errors cautiously
        // Common errors: 'bad decrypt', 'invalid key length', 'invalid iv length', 'wrong final block length'
        const errorMessage = error instanceof Error ? error.message : String(error);
        serverUtilsLogger.error({ error: errorMessage }, "Decryption failed");
        return null;
    }
}


// --- Session Token Retrieval ---
/**
 * Retrieves the encrypted access token from the session and decrypts it.
 * MUST be called within a server-side context (Server Action, Route Handler, RSC)
 * where `next/headers` cookies() is available.
 * @returns The decrypted access token string, or null if not found or decryption fails.
 */
export async function getDecryptedAccessToken(): Promise<string | null> {
    serverUtilsLogger.debug("Attempting to get decrypted access token from session...");
    try {
        const cookieStore = await cookies();
        const session = await getIronSession<SessionData>(cookieStore, getUserSessionOptions());

        if (!session.userId) {
            serverUtilsLogger.warn("No userId found in session while trying to get access token.");
            return null; // Not logged in or session invalid
        }

        const encryptedToken = session.encryptedAccessToken;
        if (!encryptedToken) {
            serverUtilsLogger.warn({ userId: session.userId }, "No encryptedAccessToken found in session.");
            // This might indicate the session is from before token encryption was added,
            // or the login process didn't save it correctly. Treat as unauthenticated.
            return null;
        }

        const token = decryptToken(encryptedToken);

        if (!token) {
             serverUtilsLogger.error({ userId: session.userId }, "Failed to decrypt access token from session.");
             // Log env var status to aid debugging decryption failures
             const hasKey = !!process.env.ACCESS_TOKEN_ENCRYPTION_KEY;
             const hasSalt = !!process.env.ACCESS_TOKEN_ENCRYPTION_SALT;
             serverUtilsLogger.warn({ hasKey, hasSalt }, "Check if ACCESS_TOKEN_ENCRYPTION_KEY and SALT are correctly set and haven't changed since encryption.");
             return null; // Decryption failed
        }
        serverUtilsLogger.debug({ userId: session.userId }, "Successfully decrypted access token.");
        return token;
    } catch (error) {
        // Errors could come from cookies() or getIronSession()
        serverUtilsLogger.error({ error }, "Error getting/decrypting access token from session");
        return null;
    }
}