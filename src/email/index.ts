/**
 * Email Module
 *
 * Centralized exports for email functionality.
 */

export { createEmailClient } from "./client";
export {
  sendClientConfirmation,
  sendDriverNotification,
  sendBookingConfirmationEmails,
} from "./send";