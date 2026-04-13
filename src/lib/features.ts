/**
 * Feature flags used across the app.
 *
 * Public feature flag shared by client and server.
 */
export const isPaymentsEnabled = (): boolean =>
  process.env.NEXT_PUBLIC_PAYMENT_SYSTEM_ENABLED === "true";

