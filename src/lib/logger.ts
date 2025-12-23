/* eslint-disable no-console */
/**
 * Application Logger
 * 
 * Centralized logging utility for the entire application.
 * Supports context-based logging to identify the source of logs (CMS, API, Email, etc.)
 */

interface LogContext {
  [key: string]: unknown;
}

/**
 * Log module identifiers
 * Used to categorize and identify the source of log messages
 */
export enum LogModule {
  CMS = "CMS",
  API = "API",
  Email = "Email",
  Database = "Database",
  Auth = "Auth",
  Booking = "Booking",
  App = "App",
}

/**
 * Log an error with context
 * 
 * @param message - Error message
 * @param error - Error object or additional context
 * @param context - Additional context (function name, document ID, etc.)
 * @param module - Optional module name to identify the source (CMS, API, Email, etc.)
 */
export const logError = (
  message: string,
  error?: unknown,
  context?: LogContext,
  module?: LogModule
): void => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const modulePrefix = module ? `[${module}]` : "";

  if (isDevelopment) {
    // In development, log to console with full details
    console.error(`${modulePrefix} Error: ${message}`, {
      error,
      ...context,
      timestamp: new Date().toISOString(),
    });
  } else {
    // In production, you could send to a logging service
    // For now, we'll still log to console (Vercel/Next.js will capture these)
    // TODO: Integrate with logging service (Sentry, LogRocket, etc.)
    console.error(`${modulePrefix} Error: ${message}`, {
      error: error instanceof Error ? error.message : String(error),
      ...context,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Log a warning with context
 * 
 * @param message - Warning message
 * @param context - Additional context
 * @param module - Optional module name to identify the source
 */
export const logWarning = (
  message: string,
  context?: LogContext,
  module?: LogModule
): void => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const modulePrefix = module ? `[${module}]` : "";

  if (isDevelopment) {
    console.warn(`${modulePrefix} Warning: ${message}`, {
      ...context,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Log info (for debugging)
 * 
 * @param message - Info message
 * @param context - Additional context
 * @param module - Optional module name to identify the source
 */
export const logInfo = (
  message: string,
  context?: LogContext,
  module?: LogModule
): void => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const modulePrefix = module ? `[${module}]` : "";

  if (isDevelopment) {
    console.info(`${modulePrefix} Info: ${message}`, {
      ...context,
      timestamp: new Date().toISOString(),
    });
  }
};

