/* eslint-disable no-console */
/**
 * CMS Logger
 * 
 * Centralized logging utility for CMS operations.
 * 
 */


interface LogContext {
  [key: string]: unknown
}

/**
 * Log an error with context
 * 
 * @param message - Error message
 * @param error - Error object or additional context
 * @param context - Additional context (function name, document ID, etc.)
 */
export function logError(
  message: string,
  error?: unknown,
  context?: LogContext
): void {
  const isDevelopment = process.env.NODE_ENV === "development"

  if (isDevelopment) {
    // In development, log to console with full details
    console.error(`[CMS Error] ${message}`, {
      error,
      ...context,
      timestamp: new Date().toISOString(),
    })
  } else {
    // In production, you could send to a logging service
    // For now, we'll still log to console (Vercel/Next.js will capture these)
    // TODO: Integrate with logging service (Sentry, LogRocket, etc.)
    console.error(`[CMS Error] ${message}`, {
      error: error instanceof Error ? error.message : String(error),
      ...context,
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Log a warning with context
 */
export function logWarning(message: string, context?: LogContext): void {
  const isDevelopment = process.env.NODE_ENV === "development"

  if (isDevelopment) {
    console.warn(`[CMS Warning] ${message}`, {
      ...context,
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Log info (for debugging)
 */
export function logInfo(message: string, context?: LogContext): void {
  const isDevelopment = process.env.NODE_ENV === "development"

  if (isDevelopment) {
    console.info(`[CMS Info] ${message}`, {
      ...context,
      timestamp: new Date().toISOString(),
    })
  }
}

