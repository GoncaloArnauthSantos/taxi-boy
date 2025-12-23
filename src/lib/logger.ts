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

type BaseLogParams = {
  message: string;
  context?: LogContext;
  module?: LogModule;
};

type ErrorLogParams = BaseLogParams & {
  error?: unknown;
};

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
 * @param params.message - Error message
 * @param params.error - Error object or additional context
 * @param params.context - Additional context (function name, document ID, etc.)
 * @param params.module - Optional module name to identify the source (CMS, API, Email, etc.)
 */
export const logError = ({
  message,
  error,
  context,
  module,
}: ErrorLogParams): void => {
  const nodeEnv = process.env.NODE_ENV;
  const shouldSendToSentry = nodeEnv === "production";
  const modulePrefix = module ? `[${module}]` : "";

  // First, log to console (dev, staging, prod)
  const payload = {
    error,
    ...context,
    timestamp: new Date().toISOString(),
  };

  console.error(`${modulePrefix} Error: ${message}`, payload);

  // Only send to Sentry in production
  if (!shouldSendToSentry) {
    return;
  }

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
};

/**
 * Log a warning with context
 *
 * @param params.message - Warning message
 * @param params.context - Additional context
 * @param params.module - Optional module name to identify the source
 */
export const logWarning = ({
  message,
  context,
  module,
}: BaseLogParams): void => {
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
 * @param params.message - Info message
 * @param params.context - Additional context
 * @param params.module - Optional module name to identify the source
 */
export const logInfo = ({
  message,
  context,
  module,
}: BaseLogParams): void => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const modulePrefix = module ? `[${module}]` : "";

  if (isDevelopment) {
    console.info(`${modulePrefix} Info: ${message}`, {
      ...context,
      timestamp: new Date().toISOString(),
    });
  }
};
