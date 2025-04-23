// apps/user-app/_lib/server-utils.ts
// IMPORTANT: This file contains server-only logic (Node.js crypto)
// Ensure this file is ONLY imported and used in server-side contexts (Server Actions, API Routes)
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { Buffer } from 'buffer'; // Import Buffer explicitly

const alg = 'aes-256-cbc';

// --- Encryption Key Derivation ---
// Memoize the key derivation for efficiency within a single request/process lifespan
let derivedKey: Buffer | null = null;
let keyDerivationError: Error | null = null;

function getEncryptionKey(): Buffer | null {
    if (derivedKey) return derivedKey;
    if (keyDerivationError) {
        console.error("Re-throwing previous key derivation error.");
        return null; // Avoid re-attempting if it failed before
    }

    const encryptionPassword = process.env.ACCESS_TOKEN_ENCRYPTION_KEY;
    // Use a separate, distinct salt, also stored in environment variables
    const salt = process.env.ACCESS_TOKEN_ENCRYPTION_SALT;

    if (!encryptionPassword) {
        keyDerivationError = new Error("Security Error: ACCESS_TOKEN_ENCRYPTION_KEY environment variable is not set!");
        console.error(keyDerivationError.message);
        return null;
    }
    if (!salt) {
        keyDerivationError = new Error("Security Error: ACCESS_TOKEN_ENCRYPTION_SALT environment variable is not set!");
        console.error(keyDerivationError.message);
        return null;
    }
     if (encryptionPassword.length < 32) {
         console.warn("Security Warning: ACCESS_TOKEN_ENCRYPTION_KEY should ideally be at least 32 characters long for stronger entropy.");
     }

    // Derive a 32-byte key using scrypt.
    try {
        // It's crucial that the salt is stable for decryption. Store it securely.
        derivedKey = scryptSync(encryptionPassword, salt, 32); // 32 bytes = 256 bits
        console.log("[Crypto] Encryption key derived successfully.");
        return derivedKey;
    } catch (error) {
        keyDerivationError = error instanceof Error ? error : new Error(String(error));
        console.error("Failed to derive encryption key:", keyDerivationError);
        return null;
    }
}

// --- Encryption Function ---
export function encryptToken(token: string): string | null {
    const key = getEncryptionKey();
    if (!key) return null; // Can't encrypt without a valid key

    try {
        const iv = randomBytes(16); // Generate a unique IV for each encryption
        const cipher = createCipheriv(alg, key, iv);
        let encrypted = cipher.update(token, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        // Prepend IV (hex) to the encrypted data, separated by a colon
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        console.error("Encryption failed:", error instanceof Error ? error.message : error);
        return null;
    }
}

// --- Decryption Function ---
export function decryptToken(encryptedToken: string | undefined | null): string | null {
    if (!encryptedToken) {
        console.debug("Decryption skipped: No encrypted token provided.");
        return null;
    }

    const key = getEncryptionKey();
    if (!key) {
         console.error("Decryption skipped: Encryption key is unavailable.");
        return null; // Can't decrypt without a valid key
    }

    try {
        const parts = encryptedToken.split(':');
        if (parts.length !== 2) {
            console.error("Decryption Error: Invalid encrypted token format (missing IV separator). Token:", encryptedToken.substring(0,10)+"...");
            return null; // Invalid format
        }
        const iv = Buffer.from(parts[0], 'hex');
        const encryptedText = parts[1];

        // Basic validation
        if (iv.length !== 16) {
             console.error("Decryption Error: Invalid IV length detected.", iv.length);
             return null;
        }
        if (!encryptedText || encryptedText.length === 0) {
             console.error("Decryption Error: Encrypted text part is missing.");
             return null;
        }

        const decipher = createDecipheriv(alg, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        // Log specific errors during development, but maybe less verbosely in prod
        console.error("Decryption failed:", error instanceof Error ? error.message : error);
        // Example of what might cause errors: Incorrect key, invalid IV, corrupted data, wrong encoding used ('hex' vs 'base64')
        return null; // Return null on any decryption error
    }
}