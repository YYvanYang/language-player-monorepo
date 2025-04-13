// packages/logger/src/types.ts

// Define standard log levels (Unchanged)
export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent';

// --- Refined Logger Interface ---

// Define the type signature for a log method function.
// This single signature covers both common call patterns:
// 1. logger.info('My message', ...args)
// 2. logger.info({ data: 'some data' }, 'My message', ...args)
// 3. logger.error(new Error('Something failed'), 'Context message')
export type LogFn = {
  // The most specific signature first: object/error + optional message
  (obj: Record<string, any> | Error, msg?: string, ...args: any[]): void;
  // Fallback signature: only a message string
  (msg: string, ...args: any[]): void;
};

// Define a common Logger interface that both server and client loggers adhere to
export interface Logger {
  readonly level: LogLevel; // The current logging level (make readonly after creation)

  // Standard log methods using the refined LogFn type
  fatal: LogFn;
  error: LogFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
  trace: LogFn;

  // Method to create a child logger with additional context (bindings)
  // Returns the same Logger interface type.
  child: (bindings: Record<string, any>) => Logger;

  // Silent method (typically a no-op, but defined for interface consistency)
  // Using LogFn keeps the structure uniform. The implementation will be empty.
  silent: LogFn;
}

// Configuration interface (Unchanged)
export interface LoggerConfig {
  logLevel: LogLevel;
  isProduction: boolean;
  isServer: boolean;
  // serviceName?: string; // Optional
}