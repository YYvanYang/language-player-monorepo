// packages/logger/src/client.ts
import { config, isLevelEnabled } from './config';
import type { Logger, LogLevel } from './types';

// Map log levels to console methods
const consoleMethods: Record<Exclude<LogLevel, 'silent' | 'fatal'>, keyof Console> = {
    error: 'error',
    warn: 'warn',
    info: 'info',
    debug: 'debug',
    trace: 'trace',
};

// Client logger implementation
export function createClientLogger(): Logger {
    const createLogMethod = (level: Exclude<LogLevel, 'silent'>): Logger[typeof level] => {
        // Return the actual log function
        return (...args: any[]): void => {
            // Check if this level is enabled based on config
            if (!isLevelEnabled(config.logLevel, level)) {
                return;
            }

            const logPrefix = `[${level.toUpperCase()}]`;
            const timestamp = new Date().toISOString(); // Add timestamp

            // Separate message/object arguments
            let message = '';
            let data: Record<string, any> | Error | undefined = undefined;
            const restArgs: any[] = [];

            if (typeof args[0] === 'object' && args[0] !== null && !(args[0] instanceof Error)) {
                data = args[0];
                message = typeof args[1] === 'string' ? args[1] : '';
                restArgs.push(...args.slice(2));
            } else if (args[0] instanceof Error) {
                 data = args[0];
                 message = typeof args[1] === 'string' ? args[1] : data.message; // Use error message if no explicit msg
                 restArgs.push(...args.slice(1)); // Pass error as first extra arg for console formatting
            } else {
                message = typeof args[0] === 'string' ? args[0] : '';
                restArgs.push(...args.slice(1));
            }

            // Get the appropriate console method
            const consoleMethod = consoleMethods[level] || 'log'; // Fallback to console.log

            // Construct log arguments for the console
            const logArgs = [logPrefix, timestamp, message];
            if (data) logArgs.push(data);
            if (restArgs.length > 0) logArgs.push(...restArgs);

            // Call the console method
            // Use console[method] notation for dynamic dispatch
            (console as any)[consoleMethod](...logArgs);
        };
    };

    const logger: Logger = {
        level: config.logLevel,
        fatal: (...args: any[]) => createLogMethod('error')(...args), // Map fatal to error on client
        error: createLogMethod('error'),
        warn: createLogMethod('warn'),
        info: createLogMethod('info'),
        debug: createLogMethod('debug'),
        trace: createLogMethod('trace'),
        silent: () => {}, // No-op
        // Child logger on client side simply returns the same logger instance
        // We don't typically need nested context logging in the browser console
        child: (_bindings: Record<string, any>): Logger => {
            // Could potentially add bindings to a prefix, but gets complex
            return logger;
        },
    };

    console.log(`[Logger] Client logger created with level: ${logger.level}`);
    return logger;
}