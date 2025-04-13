// packages/logger/src/server.ts
import pino from 'pino';
import type { Logger as PinoLogger } from 'pino';
import { config } from './config';
import type { Logger, LogLevel } from './types';

// Type assertion for safety, Pino types are slightly different
type PinoCompatibleLogger = Omit<Logger, 'level'> & { level: LogLevel | 'silent' };


export function createServerLogger(): Logger {
    const pinoOptions: pino.LoggerOptions = {
        level: config.logLevel,
        timestamp: pino.stdTimeFunctions.isoTime, // Use ISO 8601 format
        formatters: {
            level: (label) => ({ level: label }), // Keep level label standard
            // bindings: (bindings) => ({ // Customize how bindings (context) are displayed
            //   pid: bindings.pid,
            //   hostname: bindings.hostname,
            //   context: bindings.context // Example: nest context under a 'context' key
            // }),
        },
        // Basic redaction for common sensitive keys
        redact: {
            paths: [
                'password', 'newPassword', 'currentPassword', // Passwords
                'authorization', 'Authorization', // Headers
                'cookie', 'Cookie', // Headers
                '*.password', '*.secret', // Nested properties
                'req.headers.authorization', 'req.headers.cookie', // Express/Fastify common paths
                'user.token', // Example user token field
            ],
            censor: '[REDACTED]',
        },
        // Add service name if configured
        // base: config.serviceName ? { service: config.serviceName } : undefined,
    };

    // Use pino-pretty only in development for readability
    if (!config.isProduction) {
        pinoOptions.transport = {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l', // Human-readable time
                ignore: 'pid,hostname,context', // Fields to hide in pretty print
                messageFormat: '{context} {msg}', // Include context from child loggers before message
                levelFirst: true,
            },
        };
    }

    const loggerInstance = pino(pinoOptions);

    // Explicitly handle the possibility of 'silent' level from config
    (loggerInstance as unknown as PinoCompatibleLogger).level = config.logLevel;

    // Add a silent method for API consistency (Pino doesn't have it by default)
    const finalLogger = loggerInstance as unknown as Logger; // Assert to our interface
    finalLogger.silent = () => {}; // No-op

    console.log(`[Logger] Server logger created with level: ${finalLogger.level}`);
    return finalLogger;
}