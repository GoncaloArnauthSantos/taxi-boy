/**
 * Shared CMS Utilities
 * 
 * Re-exports shared mapper utilities and logger for convenient importing.
 */

export { asText, asHTML, mapImage } from "./mappers"
// Re-export logger from lib for backward compatibility
// All imports should now use @/lib/logger directly with appropriate module context
export { logError, logWarning, logInfo } from "@/lib/logger"

