// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Prefer environment variables so we can configure Sentry per environment
// without changing code. The wizard DSN is kept as a final fallback.
const SENTRY_DSN = process.env.SENTRY_DSN;

const TRACES_SAMPLE_RATE =
  process.env.SENTRY_TRACES_SAMPLE_RATE !== undefined
    ? Number(process.env.SENTRY_TRACES_SAMPLE_RATE)
    : 1;

// Only initialize Sentry if DSN is provided
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Environment label visible in Sentry (e.g. production, staging, preview)
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,

    // Control how much performance data is sent.
    // You can override with SENTRY_TRACES_SAMPLE_RATE env var.
    tracesSampleRate: TRACES_SAMPLE_RATE,

    // Enable sending user PII (Personally Identifiable Information).
    // Keep as-is for now; you can later gate this with an env var if needed.
    sendDefaultPii: true,
  });
}
