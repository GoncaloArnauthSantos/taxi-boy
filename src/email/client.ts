/**
 * Email Client
 *
 * Resend email client configuration.
 * This client should only be used in Server Components or API routes.
 */

import { Resend } from "resend";

export const createEmailClient = () => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY environment variable is required. " +
      "Please set it in your .env.local file."
    );
  }

  const client = new Resend(apiKey);
  return client;
};

