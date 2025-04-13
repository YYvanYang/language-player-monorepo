// packages/logger/src/index.ts
import { config } from './config';
import { createServerLogger } from './server';
import { createClientLogger } from './client';
import type { Logger, LogLevel } from './types';

let logger: Logger;

if (config.isServer) {
    // Dynamically import server logger only on the server
    // This helps prevent pino/pino-pretty from being bundled client-side
    // Note: For this dynamic import to work well with tree-shaking,
    // ensure your bundler (like Next.js with SWC/Webpack) is configured correctly.
    // If issues arise, a simpler static import might be necessary, relying
    // more heavily on tree-shaking effectiveness.
    // const { createServerLogger } = await import('./server'); // Use dynamic import if needed

    logger = createServerLogger();
} else {
    logger = createClientLogger();
}

export default logger;
export type { Logger, LogLevel }; // Export types for usage elsewhere