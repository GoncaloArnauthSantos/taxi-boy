/* eslint-disable no-console */
/**
 * Application Logger
 *
 * Centralized logging utility for the entire application.
 * Supports context-based logging to identify the source of logs (CMS, API, Email, etc.)
 *
 * This module is used both on the server (API routes, Server Components)
 * and on the client (Client Components). Sentry is initialized separately
 * via its Next.js config files; here we only *use* Sentry when available.
 */

import * as Sentry from "@sentry/nextjs";

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
  const nodeEnv = process.env.NODE_ENV;
  const isProduction = nodeEnv === "production";
  const modulePrefix = module ? `[${module}]` : "";

  // First, log to console (dev, staging, prod)
  const payload = {
    error,
    ...context,
    timestamp: new Date().toISOString(),
  };

  console.error(`${modulePrefix} Error: ${message}`, payload);

  // Only send to Sentry in production
  if (isProduction) {
    try {
      Sentry.captureException(error, {
        tags: {
          module: module ?? LogModule.App,
          nodeEnv,
        },
        extra: {
          message,
          ...context,
        },
      });
    } catch {
      // Don't let Sentry errors bubble up to the app
    }
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
