// packages/logger/src/config.ts
import type { LogLevel, LoggerConfig } from './types';

const LOG_LEVELS: Record<LogLevel, number> = {
    fatal: 60,
    error: 50,
    warn: 40,
    info: 30,
    debug: 20,
    trace: 10,
    silent: Infinity,
};

function isValidLogLevel(level: string | undefined): level is LogLevel {
    return typeof level === 'string' && level in LOG_LEVELS;
}

// Determine environment at config time
const isServer = typeof window === 'undefined';
const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

// Get log level from environment variable, default to 'info' in production, 'debug' otherwise
const defaultLogLevel: LogLevel = isProduction ? 'info' : 'debug';
const envLogLevel = process.env.LOG_LEVEL?.toLowerCase();
const logLevel: LogLevel = isValidLogLevel(envLogLevel) ? envLogLevel : defaultLogLevel;

export const config: LoggerConfig = {
    logLevel,
    isProduction,
    isServer,
    // serviceName: process.env.SERVICE_NAME || 'language-player', // Optional: Add service name
};

console.log(`[Logger Config] Initialized. Level: ${config.logLevel}, Production: ${config.isProduction}, Server: ${config.isServer}`);

// Helper function to compare levels (used internally by loggers)
export function isLevelEnabled(enabledLevel: LogLevel, targetLevel: LogLevel): boolean {
    if (enabledLevel === 'silent') return false;
    return LOG_LEVELS[targetLevel] >= LOG_LEVELS[enabledLevel];
}